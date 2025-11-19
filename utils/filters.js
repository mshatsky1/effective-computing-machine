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

function filterUsers(users, { search, role, status }) {
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

    return matches;
  });
}

module.exports = {
  filterUsers,
  isValidRole,
  isValidStatus,
  normalize
};

