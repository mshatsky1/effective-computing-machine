const fs = require('fs');
const path = require('path');

let users = [];
let nextId = 1;

function loadSeedData() {
  const seedPath = path.join(__dirname, 'seed.json');
  if (!fs.existsSync(seedPath)) {
    return;
  }

  try {
    const raw = fs.readFileSync(seedPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return;
    }
    users = parsed.map(entry => ({
      ...entry,
      id: entry.id || nextId++,
      createdAt: entry.createdAt || new Date().toISOString()
    }));
    const highestId = users.reduce((max, user) => Math.max(max, user.id), 0);
    nextId = highestId + 1;
  } catch (error) {
    console.warn('Failed to load seed data:', error.message);
  }
}

/**
 * Normalizes enum values to lowercase strings
 * @param {*} value - Value to normalize
 * @param {*} fallback - Fallback value if value is falsy
 * @returns {string} Normalized lowercase string
 */
function normalizeEnum(value, fallback) {
  return (value || fallback).toString().trim().toLowerCase();
}

/**
 * Returns a copy of all users
 * @returns {Array} Array of user objects
 */
function list() {
  return [...users];
}

/**
 * Finds a user by ID
 * @param {number} id - User ID to search for
 * @returns {Object|undefined} User object or undefined if not found
 */
function findById(id) {
  return users.find(user => user.id === id);
}

/**
 * Checks if a user with the given email exists
 * @param {string} email - Email address to check
 * @param {number|null} excludeId - User ID to exclude from check (for updates)
 * @returns {boolean} True if email exists
 */
function existsByEmail(email, excludeId = null) {
  const normalized = (email || '').trim().toLowerCase();
  return users.some(user => 
    user.email.toLowerCase() === normalized &&
    (excludeId === null || user.id !== excludeId)
  );
}

/**
 * Creates a new user
 * @param {Object} userData - User data object
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.role - User role
 * @param {string} userData.status - User status
 * @returns {Object} Created user object
 */
function create({ name, email, role, status }) {
  const timestamp = new Date().toISOString();
  const user = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
    role: normalizeEnum(role, 'member'),
    status: normalizeEnum(status, 'active'),
    createdAt: timestamp
  };
  users.push(user);
  return user;
}

function update(id, { name, email, role, status }) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return null;
  }
  const timestamp = new Date().toISOString();
  const existing = users[index];
  const updated = {
    ...existing,
    name: name.trim(),
    email: email.trim(),
    role: normalizeEnum(role, existing.role || 'member'),
    status: normalizeEnum(status, existing.status || 'active'),
    updatedAt: timestamp
  };
  users[index] = updated;
  return updated;
}

function remove(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  return true;
}

function reset() {
  users = [];
  nextId = 1;
}

loadSeedData();

module.exports = {
  list,
  findById,
  existsByEmail,
  create,
  update,
  remove,
  reset,
  loadSeedData
};

