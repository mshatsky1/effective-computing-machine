const express = require('express');
const router = express.Router();
const { validateUser } = require('../utils/validation');
const { sanitizeUserInput } = require('../utils/sanitize');
const { paginate } = require('../utils/pagination');
const userStore = require('../data/userStore');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search ? req.query.search.toLowerCase() : '';
  
  const allUsers = userStore.list();
  let filteredUsers = allUsers;
  
  // Apply search filter if provided
  if (search) {
    filteredUsers = allUsers.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }
  
  const result = paginate(filteredUsers, { page, limit });
  
  res.json(result);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = userStore.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.post('/', (req, res) => {
  const sanitized = sanitizeUserInput(req.body);
  const validation = validateUser(sanitized);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  const { name, email } = sanitized;
  
  // Check for duplicate email
  if (userStore.existsByEmail(email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const user = userStore.create({ name, email });
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  const existingUser = userStore.findById(id);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const sanitized = sanitizeUserInput(req.body);
  const validation = validateUser(sanitized);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { name, email } = sanitized;
  const trimmedEmail = email.trim();
  
  // Check for duplicate email (excluding current user)
  if (userStore.existsByEmail(trimmedEmail, id)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const updatedUser = userStore.update(id, { name, email: trimmedEmail });
  res.json(updatedUser);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const removed = userStore.remove(id);
  if (!removed) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
});

// Export reset function for testing
if (process.env.NODE_ENV === 'test') {
  router.resetUsers = userStore.reset;
}

module.exports = router;
