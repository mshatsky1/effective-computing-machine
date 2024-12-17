const { validateEmail, validateUser } = require('../utils/validation');

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    test('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });

  describe('validateUser', () => {
    test('should validate correct user', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(result.valid).toBe(true);
    });

    test('should reject user with empty name', () => {
      const result = validateUser({
        name: '',
        email: 'john@example.com'
      });
      expect(result.valid).toBe(false);
    });
  });
});

