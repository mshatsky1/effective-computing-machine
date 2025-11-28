const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
  INVALID_ID: 'Invalid user ID',
  USER_NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'Email already exists',
  VALIDATION_ERROR: 'Validation error'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

const USER_ROLES = {
  MEMBER: 'member',
  ADMIN: 'admin'
};

const LOG_LEVELS = ['info', 'silent'];

module.exports = { HTTP_STATUS, ERROR_MESSAGES, USER_STATUS, USER_ROLES, LOG_LEVELS };

