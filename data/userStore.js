let users = [];
let nextId = 1;

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

module.exports = {
  list,
  findById,
  existsByEmail,
  create,
  update,
  remove,
  reset
};

