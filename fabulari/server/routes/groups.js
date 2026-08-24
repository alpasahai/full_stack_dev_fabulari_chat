const express = require('express');
const router = express.Router();
const { read_data, write_data } = require('../utilities/json_db');

router.get('/', (req, res) => {
  res.json(read_data('groups.json'));
});

router.post('/', (req, res) => {
  const groups = read_data('groups.json');
  const new_group = {
    id: 'g' + Date.now(),
    ...req.body
  };
  groups.push(new_group);
  write_data('groups.json', groups);
  res.status(201).json(new_group);
});

module.exports = router;
