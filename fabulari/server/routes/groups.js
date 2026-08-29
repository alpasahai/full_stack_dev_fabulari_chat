const express = require('express');
const router = express.Router();
const { read_data, write_data } = require('../utilities/json_db');

router.get('/', (req, res) => {
  res.json(read_data('groups.json'));
});

router.post('/', (req, res) => {
  const groups = read_data('groups.json');
  //Actually creating a new group
  const new_group = {
    id: 'g' + Date.now(),
    name: req.body.name,
    adminId: req.body.adminId,
    memberIds: [req.body.adminId],
    channelIds: [],
    status: 'pending'
  };
  groups.push(new_group);
  write_data('groups.json', groups);
  res.status(201).json(new_group);
});

//SA approval:
router.patch('/:id/status', (req, res) => {
  const groups = read_data('groups.json');
  const group = groups.find(g => g.id === req.params.id);
  if (!group) return res.status(404).json({message: 'Group not found'});

  group.status = req.body.status; // approved and declined
  write_data('groups.json', groups);
  res.json(group);
});

//Assigning a GA
router.post('/:id/members', (req, res) => {
  const groups = read_data('groups.json');
  const group = groups.find(g => g.id === req.params.id);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  if (!group.memberIds.includes(req.body.userId)) {
    group.memberIds.push(req.body.userId);
  }
  write_data('groups.json', groups);
  res.json(group);
});

module.exports = router;
