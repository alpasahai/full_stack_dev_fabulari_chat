const express = require('express');
const router = express.Router();
const { read_data, write_data } = require('../utilities/json_db');

router.get('/', (req, res) => {
  res.json(read_data('users.json'));
});

router.post('/', (req, res) => {
  const users = read_data('users.json');
  const new_user = {
    id: 'u' + Date.now(),
    ...req.body
  };
  users.push(new_user);
  write_data('users.json', users);
  res.status(201).json(new_user);
});

module.exports = router;
