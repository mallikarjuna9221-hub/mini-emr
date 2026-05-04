const router = require('express').Router();
const User = require('../models/User');

// POST create appointment for a patient
router.post('/patients/:patientId/appointments', async (req, res) => {
  try {
    const { provider, datetime, repeat, endDate } = req.body;
    if (!provider || !datetime) return res.status(400).json({ error: 'provider and datetime required' });

    const user = await User.findById(req.params.patientId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    const appt = { provider, datetime, repeat: repeat || 'none' };
    if (endDate) appt.endDate = endDate;

    user.appointments.push(appt);
    await user.save();
    res.status(201).json(user.appointments[user.appointments.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update appointment
router.put('/appointments/:patientId/:apptId', async (req, res) => {
  try {
    const user = await User.findById(req.params.patientId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    const appt = user.appointments.id(req.params.apptId);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    const { provider, datetime, repeat, endDate } = req.body;
    if (provider !== undefined) appt.provider = provider;
    if (datetime !== undefined) appt.datetime = datetime;
    if (repeat !== undefined) appt.repeat = repeat;
    appt.endDate = endDate || null;

    await user.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE appointment
router.delete('/appointments/:patientId/:apptId', async (req, res) => {
  try {
    const user = await User.findById(req.params.patientId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    const appt = user.appointments.id(req.params.apptId);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    appt.deleteOne();
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
