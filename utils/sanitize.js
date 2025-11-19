function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '')
    .trim();
}

function sanitizeOptionalString(str) {
  if (typeof str === 'undefined' || str === null) return undefined;
  return sanitizeString(str);
}

function sanitizeUserInput(user = {}) {
  return {
    name: sanitizeString(user.name),
    email: sanitizeString(user.email),
    role: sanitizeOptionalString(user.role),
    status: sanitizeOptionalString(user.status)
  };
}

module.exports = { sanitizeString, sanitizeUserInput };

