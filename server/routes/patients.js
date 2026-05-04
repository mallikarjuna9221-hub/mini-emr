const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET all patients (at-a-glance)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email appointments prescriptions createdAt');
    const result = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      appointmentCount: u.appointments.length,
      prescriptionCount: u.prescriptions.length,
      createdAt: u.createdAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single patient (full detail)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ error: 'Patient not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create patient
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, and password required' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });
    await user.save();
    const { password: _, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PUT update patient (name, email, optionally password)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ error: 'Patient not found' });
    res.json(user);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
