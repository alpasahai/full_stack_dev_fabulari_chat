const express = require('express');
const router = express.Router();
const { read_data, write_data } = require('../utilities/json_db');

//Listing channels for a group
router.get('/', (req, res) => {
  const channels = read_data('channels.json');
  if (req.query.groupId) {
    return res.json(channels.filter(c => c.groupId === req.query.groupId));
  }
  res.json(channels);
});

//Creating a channel only for GA - relying solely on frontend access atm
router.post('/', (req, res) => {
  const channels = read_data('channels.json');
  const groups = read_data('groups.json');

  const new_channel = {
    id: 'c' + Date.now(),
    name: req.body.name,
    groupId: req.body.groupId,
    memberIds: req.body.memberIds || []
  };
  channels.push(new_channel);
  write_data('channels.json', channels);

  //Keep the group channel ids in synccc
  const group = groups.find(g => g.id === req.body.groupId);
  if (group) {
    group.channelIds.push(new_channel.id);
    write_data('groups.json', groups);
  }
  res.status(201).json(new_channel);
});

//Assigning users to a channel/room - lowkey use that interchangebalyyy
router.post('/:id/members', (req, res) => {
  const channels = read_data('channels.json');
  const channel = channels.find(c => c.id === req.params.id);
  if (!channel) return res.status(404).json({ message: 'Channel not found' });

  if (!channel.memberIds.includes(req.body.userId)) {
    channel.memberIds.push(req.body.userId);
  }
  write_data('channels.json', channels);
  res.json(channel);
});

module.exports = router;
