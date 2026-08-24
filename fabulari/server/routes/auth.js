const express = require('express');
const router = express.Router();
const { read_data } = require('../utilities/json_db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = read_data('users.json');

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  //Ensuring the password isn't sent back to the client
  const { password: _pw, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;
