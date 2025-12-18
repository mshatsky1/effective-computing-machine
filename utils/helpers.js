/**
 * Formats a successful API response
 * @param {*} data - The response data
 * @param {string|null} message - Optional success message
 * @returns {Object} Formatted response object
 */
function formatResponse(data, message = null) {
  const response = { success: true, data };
  if (message) {
    response.message = message;
  }
  return response;
}

/**
 * Formats an error response
 * @param {string} message - Error message
 * @param {string|null} code - Optional error code
 * @returns {Object} Formatted error response object
 */
function formatError(message, code = null) {
  const error = { success: false, error: message };
  if (code) {
    error.code = code;
  }
  return error;
}

/**
 * Generates a unique identifier using timestamp and random string
 * @returns {string} Unique identifier
 */
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return `${timestamp}-${random}`;
}

module.exports = { formatResponse, formatError, generateId };

