require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Reference = require('./models/Reference');

const medications = ['Diovan', 'Lexapro', 'Metformin', 'Ozempic', 'Prozac', 'Seroquel', 'Tegretol'];
const dosages = ['1mg', '2mg', '3mg', '5mg', '10mg', '25mg', '50mg', '100mg', '250mg', '500mg', '1000mg'];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Reference.deleteMany({});

  const hash = await bcrypt.hash('admin123', 10);

  await User.insertMany([
    {
      name: 'Mark Johnson',
      email: 'admin@admin.com',
      password: hash,
      appointments: [
        { provider: 'Dr Kim West',  datetime: new Date('2026-05-16T16:30:00.000-07:00'), repeat: 'weekly' },
        { provider: 'Dr Lin James', datetime: new Date('2026-05-19T18:30:00.000-07:00'), repeat: 'monthly' },
      ],
      prescriptions: [
        { medication: 'Lexapro',  dosage: '5mg',   quantity: 2, refillOn: new Date('2026-05-05'), refillSchedule: 'monthly' },
        { medication: 'Ozempic',  dosage: '1mg',   quantity: 1, refillOn: new Date('2026-05-10'), refillSchedule: 'monthly' },
      ],
    },
    {
      name: 'Lisa Smith',
      email: 'lisa@admin.com',
      password: hash,
      appointments: [
        { provider: 'Dr Sally Field', datetime: new Date('2026-05-22T18:15:00.000-07:00'), repeat: 'monthly' },
        { provider: 'Dr Lin James',   datetime: new Date('2026-05-25T20:00:00.000-07:00'), repeat: 'weekly' },
      ],
      prescriptions: [
        { medication: 'Metformin', dosage: '500mg', quantity: 2, refillOn: new Date('2026-05-15'), refillSchedule: 'monthly' },
        { medication: 'Diovan',    dosage: '100mg', quantity: 1, refillOn: new Date('2026-05-25'), refillSchedule: 'monthly' },
      ],
    },
  ]);

  await Reference.insertMany([
    { type: 'medications', values: medications },
    { type: 'dosages', values: dosages },
  ]);

  console.log('Seed complete: 2 users, medications, dosages');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
