const express = require('express');
const router = express.Router();
const { read_data, write_data } = require('../utilities/json_db');

router.get('/', (req, res) => {
  res.json(read_data('channels.json'));
});

router.post('/', (req, res) => {
  const channels = read_data('channels.json');
  const new_channel = {
    id: 'c' + Date.now(),
    ...req.body
  };
  channels.push(new_channel);
  write_data('channels.json', channels);
  res.status(201).json(new_channel);
});

module.exports = router;
