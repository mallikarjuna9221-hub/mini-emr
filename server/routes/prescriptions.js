const router = require('express').Router();
const User = require('../models/User');

// POST create prescription for a patient
router.post('/patients/:patientId/prescriptions', async (req, res) => {
  try {
    const { medication, dosage, quantity, refillOn, refillSchedule } = req.body;
    if (!medication || !dosage || !quantity || !refillOn || !refillSchedule) {
      return res.status(400).json({ error: 'All prescription fields required' });
    }

    const user = await User.findById(req.params.patientId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    user.prescriptions.push({ medication, dosage, quantity, refillOn, refillSchedule });
    await user.save();
    res.status(201).json(user.prescriptions[user.prescriptions.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update prescription
router.put('/prescriptions/:patientId/:rxId', async (req, res) => {
  try {
    const user = await User.findById(req.params.patientId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    const rx = user.prescriptions.id(req.params.rxId);
    if (!rx) return res.status(404).json({ error: 'Prescription not found' });

    const { medication, dosage, quantity, refillOn, refillSchedule } = req.body;
    if (medication !== undefined) rx.medication = medication;
    if (dosage !== undefined) rx.dosage = dosage;
    if (quantity !== undefined) rx.quantity = quantity;
    if (refillOn !== undefined) rx.refillOn = refillOn;
    if (refillSchedule !== undefined) rx.refillSchedule = refillSchedule;

    await user.save();
    res.json(rx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE prescription
router.delete('/prescriptions/:patientId/:rxId', async (req, res) => {
  try {
    const user = await User.findById(req.params.patientId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    const rx = user.prescriptions.id(req.params.rxId);
    if (!rx) return res.status(404).json({ error: 'Prescription not found' });

    rx.deleteOne();
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
