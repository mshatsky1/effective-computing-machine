const { USER_ROLES, USER_STATUS } = require('./constants');

/**
 * Validates an email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a user object
 * @param {Object} user - User object to validate
 * @returns {Object} Validation result with valid flag and optional error message
 */
function validateUser(user) {
  if (!user || typeof user !== 'object') {
    return { valid: false, error: 'User data is required' };
  }
  if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }
  if (user.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (user.name.trim().length > 100) {
    return { valid: false, error: 'Name must not exceed 100 characters' };
  }
  if (!user.email || typeof user.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }
  if (!validateEmail(user.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (user.role && !Object.values(USER_ROLES).includes(user.role)) {
    return { valid: false, error: `Role must be one of: ${Object.values(USER_ROLES).join(', ')}` };
  }
  if (user.status && !Object.values(USER_STATUS).includes(user.status)) {
    return { valid: false, error: `Status must be one of: ${Object.values(USER_STATUS).join(', ')}` };
  }
  return { valid: true };
}

module.exports = { validateEmail, validateUser };

