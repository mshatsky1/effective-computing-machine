const { USER_ROLES, USER_STATUS } = require('./constants');

function normalize(value) {
  if (!value) return undefined;
  return value.toString().trim().toLowerCase();
}

function isValidRole(role) {
  return Object.values(USER_ROLES).includes(role);
}

function isValidStatus(status) {
  return Object.values(USER_STATUS).includes(status);
}

function filterUsers(users, { search, role, status, createdAfter, createdBefore, updatedAfter, updatedBefore }) {
  const normalizedSearch = normalize(search);
  const normalizedRole = normalize(role);
  const normalizedStatus = normalize(status);

  return users.filter(user => {
    let matches = true;

    if (normalizedSearch) {
      const target = `${user.name} ${user.email}`.toLowerCase();
      matches = matches && target.includes(normalizedSearch);
    }

    if (normalizedRole && matches) {
      matches = user.role === normalizedRole;
    }

    if (normalizedStatus && matches) {
      matches = user.status === normalizedStatus;
    }

    if (createdAfter && matches) {
      matches = new Date(user.createdAt) >= createdAfter;
    }

    if (createdBefore && matches) {
      matches = new Date(user.createdAt) <= createdBefore;
    }

    if (updatedAfter && matches && user.updatedAt) {
      matches = new Date(user.updatedAt) >= updatedAfter;
    }

    if (updatedBefore && matches && user.updatedAt) {
      matches = new Date(user.updatedAt) <= updatedBefore;
    }

    return matches;
  });
}

function sortUsers(users, sortField = 'createdAt', direction = 'desc') {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...users].sort((a, b) => {
    const left = a[sortField];
    const right = b[sortField];

    if (!left && !right) return 0;
    if (!left) return 1 * multiplier;
    if (!right) return -1 * multiplier;

    if (sortField === 'name') {
      return left.localeCompare(right) * multiplier;
    }

    const leftTime = new Date(left).getTime();
    const rightTime = new Date(right).getTime();
    return (leftTime - rightTime) * multiplier;
  });
}

module.exports = {
  filterUsers,
  isValidRole,
  isValidStatus,
  normalize,
  sortUsers
};

