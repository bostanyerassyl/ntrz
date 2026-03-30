import { normalizeUserRole, type UserRole } from "@/functions/permissions";

export type StoredUserSession = {
  id: string;
  login: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export const userSessionStorageKey = "portal-user-session";

export function setStoredUserSession(session: StoredUserSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(userSessionStorageKey, JSON.stringify(session));
}

export function getStoredUserSession(): StoredUserSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(userSessionStorageKey);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as Partial<StoredUserSession>;

    if (!parsedSession.login || !parsedSession.email || !parsedSession.role) {
      return null;
    }

    return {
      id: parsedSession.id ?? "",
      login: parsedSession.login,
      email: parsedSession.email,
      role: normalizeUserRole(parsedSession.role),
      createdAt: parsedSession.createdAt ?? "",
    };
  } catch {
    return null;
  }
}

export function clearStoredUserSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(userSessionStorageKey);
}
