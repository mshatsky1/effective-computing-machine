const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MIN_PAGE = 1;
const MIN_LIMIT = 1;

/**
 * Paginates an array of items
 * @param {Array} items - Array of items to paginate
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @returns {Object} Paginated result with data and pagination metadata
 */
function paginate(items, { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) {
  const safePage = page < MIN_PAGE ? DEFAULT_PAGE : page;
  const safeLimit = limit < MIN_LIMIT ? DEFAULT_LIMIT : limit;
  const startIndex = (safePage - 1) * safeLimit;
  const endIndex = safePage * safeLimit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: items.length,
      totalPages: Math.ceil(items.length / safeLimit) || 1
    }
  };
}

module.exports = { paginate };

