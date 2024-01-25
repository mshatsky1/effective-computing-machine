function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUser(user) {
  if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }
  if (user.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (!user.email || typeof user.email !== 'string' || !validateEmail(user.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

module.exports = { validateEmail, validateUser };

