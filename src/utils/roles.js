export const ROLES = {
  CLIENTE: "cliente",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
};

export function getHomePathForRole(role) {
  if (role === ROLES.CLIENTE) {
    return "/cliente";
  }

  if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
    return "/admin";
  }

  return "/login";
}

export function isAdminRole(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
}

export function isClienteRole(role) {
  return role === ROLES.CLIENTE;
}
