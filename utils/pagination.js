function paginate(items, { page = 1, limit = 10 } = {}) {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit < 1 ? 10 : limit;
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

