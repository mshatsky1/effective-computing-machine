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

function formatError(message, code = null) {
  const error = { success: false, error: message };
  if (code) {
    error.code = code;
  }
  return error;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = { formatResponse, formatError, generateId };

