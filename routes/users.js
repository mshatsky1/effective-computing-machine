const express = require('express');
const router = express.Router();
const { validateUser } = require('../utils/validation');

let users = [];
let nextId = 1;

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.post('/', (req, res) => {
  const validation = validateUser(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  const { name, email } = req.body;
  const user = { id: nextId++, name: name.trim(), email: email.trim() };
  users.push(user);
  res.status(201).json(user);
});

module.exports = router;
