const router = require('express').Router();
const Reference = require('../models/Reference');

router.get('/medications', async (req, res) => {
  const doc = await Reference.findOne({ type: 'medications' });
  res.json(doc ? doc.values : []);
});

router.get('/dosages', async (req, res) => {
  const doc = await Reference.findOne({ type: 'dosages' });
  res.json(doc ? doc.values : []);
});

module.exports = router;
