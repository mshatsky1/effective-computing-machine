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

function normalizeEnum(value, fallback) {
  return (value || fallback).toString().trim().toLowerCase();
}

function list() {
  return [...users];
}

function findById(id) {
  return users.find(user => user.id === id);
}

function existsByEmail(email, excludeId = null) {
  const normalized = (email || '').trim().toLowerCase();
  return users.some(user => 
    user.email.toLowerCase() === normalized &&
    (excludeId === null || user.id !== excludeId)
  );
}

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

