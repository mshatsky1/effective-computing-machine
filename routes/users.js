const express = require('express');
const router = express.Router();
const { validateUser } = require('../utils/validation');
const { sanitizeUserInput } = require('../utils/sanitize');
const { paginate } = require('../utils/pagination');
const { USER_ROLES, USER_STATUS } = require('../utils/constants');
const { filterUsers, isValidRole, isValidStatus, normalize, sortUsers } = require('../utils/filters');
const userStore = require('../data/userStore');

const SORT_FIELDS = {
  createdat: 'createdAt',
  updatedat: 'updatedAt',
  name: 'name'
};
const SORT_DIRECTIONS = new Set(['asc', 'desc']);

/**
 * Parses a date parameter from query string
 * @param {string} value - Date string to parse
 * @param {string} label - Label for error message
 * @returns {Date|null} Parsed date or null if value is empty
 * @throws {Error} If date format is invalid
 */
function parseDateParam(value, label) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error(`Invalid ${label} date format`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

router.get('/', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search ? req.query.search.trim() : '';
  const role = normalize(req.query.role);
  const status = normalize(req.query.status);
  let createdAfter;
  let createdBefore;
  let updatedAfter;
  let updatedBefore;
  const requestedSort = (req.query.sort || 'createdAt').toString().trim().toLowerCase();
  const direction = (req.query.direction || 'desc').toString().trim().toLowerCase();

  try {
    createdAfter = parseDateParam(req.query.createdAfter, 'createdAfter');
    createdBefore = parseDateParam(req.query.createdBefore, 'createdBefore');
    updatedAfter = parseDateParam(req.query.updatedAfter, 'updatedAfter');
    updatedBefore = parseDateParam(req.query.updatedBefore, 'updatedBefore');
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }

  const sortField = SORT_FIELDS[requestedSort];
  if (!sortField) {
    return res.status(400).json({ error: 'Invalid sort field' });
  }

  if (!SORT_DIRECTIONS.has(direction)) {
    return res.status(400).json({ error: 'Invalid sort direction' });
  }

  if (role && !isValidRole(role)) {
    return res.status(400).json({ error: 'Invalid role filter' });
  }

  if (status && !isValidStatus(status)) {
    return res.status(400).json({ error: 'Invalid status filter' });
  }
  
  const allUsers = userStore.list();
  const filteredUsers = filterUsers(allUsers, { search, role, status, createdAfter, createdBefore, updatedAfter, updatedBefore });
  const orderedUsers = sortUsers(filteredUsers, sortField, direction);

  const result = paginate(orderedUsers, { page, limit });
  
  res.json({
    ...result,
    filters: {
      search: search || null,
      role: role || null,
      status: status || null,
      createdAfter: createdAfter ? createdAfter.toISOString() : null,
      createdBefore: createdBefore ? createdBefore.toISOString() : null,
      updatedAfter: updatedAfter ? updatedAfter.toISOString() : null,
      updatedBefore: updatedBefore ? updatedBefore.toISOString() : null,
      sort: sortField,
      direction
    }
  });
});

router.get('/summary', (req, res) => {
  const allUsers = userStore.list();
  const summary = allUsers.reduce((acc, user) => {
    acc.byStatus[user.status] = (acc.byStatus[user.status] || 0) + 1;
    acc.byRole[user.role] = (acc.byRole[user.role] || 0) + 1;
    return acc;
  }, { total: allUsers.length, byStatus: {}, byRole: {} });

  res.json(summary);
});

router.get('/export', (req, res) => {
  const allUsers = userStore.list();
  const header = ['id', 'name', 'email', 'role', 'status', 'createdAt', 'updatedAt'];
  const rows = allUsers.map(user => header.map(field => `"${(user[field] ?? '').toString().replace(/"/g, '""')}"`).join(','));
  const body = [header.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
  res.send(body);
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
  const payload = {
    ...sanitized,
    role: (sanitized.role || USER_ROLES.MEMBER).toLowerCase(),
    status: (sanitized.status || USER_STATUS.ACTIVE).toLowerCase()
  };
  const validation = validateUser(payload);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  const { name, email, role, status } = payload;
  
  // Check for duplicate email
  if (userStore.existsByEmail(email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const user = userStore.create({ name, email, role, status });
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
  const payload = {
    ...sanitized,
    role: (sanitized.role || existingUser.role || USER_ROLES.MEMBER).toLowerCase(),
    status: (sanitized.status || existingUser.status || USER_STATUS.ACTIVE).toLowerCase()
  };
  const validation = validateUser(payload);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { name, email, role, status } = payload;
  const trimmedEmail = email.trim();
  
  // Check for duplicate email (excluding current user)
  if (userStore.existsByEmail(trimmedEmail, id)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const updatedUser = userStore.update(id, { name, email: trimmedEmail, role, status });
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
