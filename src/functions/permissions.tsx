export type UserRole = "student" | "teacher" | "parent" | "admin";

export const defaultUserRole: UserRole = "student";

export const roleRoutes: Record<UserRole, string> = {
  student: "/student",
  teacher: "/teacher",
  parent: "/parent",
  admin: "/admin",
};

export const rolePermissions: Record<UserRole, string[]> = {
  student: ["grades:read", "goals:read", "goals:write", "rating:read"],
  teacher: ["students:read", "risk:read", "grades:read"],
  parent: ["child:read", "progress:read", "issues:read"],
  admin: ["news:write", "school:read", "roles:manage"],
};

export function isUserRole(value: string): value is UserRole {
  return ["student", "teacher", "parent", "admin"].includes(value);
}

export function normalizeUserRole(role: string | null | undefined): UserRole {
  if (role && isUserRole(role)) {
    return role;
  }

  return defaultUserRole;
}

export function hasPermission(role: UserRole, permission: string) {
  return rolePermissions[role].includes(permission);
}

export function getRoleHomeRoute(role: UserRole) {
  return roleRoutes[role];
}
