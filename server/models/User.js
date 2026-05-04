const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
  provider: { type: String, required: true },
  datetime: { type: Date, required: true },
  repeat:   { type: String, enum: ['none', 'weekly', 'monthly'], default: 'none' },
  endDate:  { type: Date, default: null },
});

const prescriptionSchema = new Schema({
  medication:     { type: String, required: true },
  dosage:         { type: String, required: true },
  quantity:       { type: Number, required: true },
  refillOn:       { type: Date, required: true },
  refillSchedule: { type: String, required: true },
});

const userSchema = new Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true },
  appointments:  [appointmentSchema],
  prescriptions: [prescriptionSchema],
}, { timestamps: true });

module.exports = model('User', userSchema);
