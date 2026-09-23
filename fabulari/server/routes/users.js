const express = require('express');
const router = express.Router();
const { read_data, write_data } = require('../utilities/json_db');
 
router.get('/', (req, res) => {
  res.json(read_data('users.json'));
});
 
router.post('/', (req, res) => {
  const users = read_data('users.json');
  const { username, email, password, dob } = req.body;
 
  //Server-side validation - never trust the client alone
  if (!username || !username.trim()) {
    return res.status(400).json({ message: 'Username is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  if (!dob) {
    return res.status(400).json({ message: 'Date of birth is required' });
  }
 
  //checking for duplicate users:
  const user_exists = users.find(u => u.username === username);
  if (user_exists) {
    return res.status(400).json({ message: 'Username already taken' });
  }
 
  //Creating a new user object
  const new_user = {
    id: 'u' + Date.now(),
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    dob: req.body.dob || null,
    avatarUrl: req.body.avatarUrl || null,
    theme: req.body.theme || 'theme-1',
    role: 'user', //signup always creates a plain user
    groupIds: []
  };
  users.push(new_user);
  write_data('users.json', users);
 
  const { password: _pw, ...safe_user } = new_user;
  res.status(201).json(safe_user);
});
 
//Allowing for Groups Page to list users:
router.get('/:id', (req, res) => {
  const users = read_data('users.json');
  const user = users.find(u => u.id === req.params.id);
 
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe_user } = user;
 
  res.json(safe_user);
});
 
//Allowing for profile page to be editted:
router.patch('/:id', (req, res) => {
  const users = read_data('users.json');
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
 
  Object.assign(user, req.body);
  write_data('users.json', users);
  const { password, ...safe_user } = user;
  
  res.json(safe_user);
});
 
module.exports = router;
 