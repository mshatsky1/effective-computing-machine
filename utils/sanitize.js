/**
 * Sanitizes a string by removing HTML-like characters and trimming whitespace
 * @param {*} str - Value to sanitize
 * @returns {*} Sanitized string or original value if not a string
 */
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

/**
 * Sanitizes user input object by cleaning all string fields
 * @param {Object} user - User object to sanitize
 * @returns {Object} Sanitized user object
 */
function sanitizeUserInput(user = {}) {
  return {
    name: sanitizeString(user.name),
    email: sanitizeString(user.email),
    role: sanitizeOptionalString(user.role),
    status: sanitizeOptionalString(user.status)
  };
}

module.exports = { sanitizeString, sanitizeUserInput };

