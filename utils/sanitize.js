function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '')
    .trim();
}

function sanitizeUserInput(user) {
  return {
    name: sanitizeString(user.name),
    email: sanitizeString(user.email)
  };
}

module.exports = { sanitizeString, sanitizeUserInput };

