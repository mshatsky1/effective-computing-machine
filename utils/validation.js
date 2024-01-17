function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUser(user) {
  if (!user.name || user.name.trim().length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }
  if (!user.email || !validateEmail(user.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

module.exports = { validateEmail, validateUser };

