const { Schema, model } = require('mongoose');

const referenceSchema = new Schema({
  type:   { type: String, required: true, unique: true },
  values: [String],
});

module.exports = model('Reference', referenceSchema);
