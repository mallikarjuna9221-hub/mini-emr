const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { expandAppointment, nextRefillDate } = require('../utils/recurrence');

router.use(auth);

// GET /api/portal/me — summary with 7-day window
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId, '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);

    const upcomingAppointments = [];
    for (const appt of user.appointments) {
      const occurrences = expandAppointment(appt, today, in7);
      for (const dt of occurrences) {
        upcomingAppointments.push({
          _id: appt._id,
          provider: appt.provider,
          datetime: dt,
          repeat: appt.repeat,
        });
      }
    }
    upcomingAppointments.sort((a, b) => a.datetime - b.datetime);

    const upcomingRefills = [];
    for (const rx of user.prescriptions) {
      const next = nextRefillDate(rx);
      if (next <= in7) {
        upcomingRefills.push({
          _id: rx._id,
          medication: rx.medication,
          dosage: rx.dosage,
          quantity: rx.quantity,
          refillOn: next,
          refillSchedule: rx.refillSchedule,
        });
      }
    }
    upcomingRefills.sort((a, b) => a.refillOn - b.refillOn);

    res.json({
      patient: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
      upcomingAppointments,
      upcomingRefills,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/portal/appointments — full 3-month schedule
router.get('/appointments', async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'appointments');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in3months = new Date(today);
    in3months.setMonth(in3months.getMonth() + 3);

    const result = [];
    for (const appt of user.appointments) {
      const occurrences = expandAppointment(appt, today, in3months);
      for (const dt of occurrences) {
        result.push({
          _id: appt._id,
          provider: appt.provider,
          datetime: dt,
          repeat: appt.repeat,
          endDate: appt.endDate,
        });
      }
    }
    result.sort((a, b) => a.datetime - b.datetime);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/portal/prescriptions — all prescriptions with next refill
router.get('/prescriptions', async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'prescriptions');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = user.prescriptions.map(rx => ({
      _id: rx._id,
      medication: rx.medication,
      dosage: rx.dosage,
      quantity: rx.quantity,
      refillSchedule: rx.refillSchedule,
      nextRefill: nextRefillDate(rx),
    }));
    result.sort((a, b) => a.nextRefill - b.nextRefill);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
