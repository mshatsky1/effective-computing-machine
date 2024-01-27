const express = require('express');
const router = express.Router();
const { validateUser } = require('../utils/validation');

let users = [];
let nextId = 1;

// Helper function to reset users (for testing)
function resetUsers() {
  users = [];
  nextId = 1;
}

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = users.find(u => u.id === id);
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
  
  // Check for duplicate email
  if (users.some(u => u.email === email.trim())) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const user = { id: nextId++, name: name.trim(), email: email.trim() };
  users.push(user);
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const validation = validateUser(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { name, email } = req.body;
  const trimmedEmail = email.trim();
  
  // Check for duplicate email (excluding current user)
  const duplicateUser = users.find(u => u.email === trimmedEmail && u.id !== id);
  if (duplicateUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  users[index] = { id, name: name.trim(), email: trimmedEmail };
  res.json(users[index]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send();
});

// Export reset function for testing
if (process.env.NODE_ENV === 'test') {
  router.resetUsers = resetUsers;
}

module.exports = router;
