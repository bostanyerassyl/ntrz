import { createPasswordHash } from "@/functions/registration";
import { supabase } from "@/functions/supabase";

export const loginFields = {
  login: {
    id: "login-user",
    name: "login",
  },
  password: {
    id: "login-password",
    name: "password",
  },
} as const;

export type LoginInput = {
  login: string;
  password: string;
};

export class LoginValidationError extends Error {
  constructor(
    public readonly code:
      | "login_required"
      | "password_required"
      | "invalid_credentials",
  ) {
    super(code);
    this.name = "LoginValidationError";
  }
}

export function normalizeLoginInput(input: LoginInput): LoginInput {
  return {
    login: input.login.trim(),
    password: input.password.trim(),
  };
}

export function validateLoginInput(input: LoginInput): LoginInput {
  const normalizedInput = normalizeLoginInput(input);

  if (!normalizedInput.login) {
    throw new LoginValidationError("login_required");
  }

  if (!normalizedInput.password) {
    throw new LoginValidationError("password_required");
  }

  return normalizedInput;
}

export async function loginUser(input: LoginInput) {
  const validatedInput = validateLoginInput(input);
  const passwordHash = await createPasswordHash(validatedInput.password);

  const { data, error } = await supabase.rpc("verify_login", {
    input_login: validatedInput.login,
    input_password_hash: passwordHash,
  });

  if (error) {
    throw new Error(error.message);
  }

  const matchedUser = Array.isArray(data) ? data[0] : data;

  if (!matchedUser) {
    throw new LoginValidationError("invalid_credentials");
  }

  return {
    id: matchedUser.id,
    login: matchedUser.login,
    email: matchedUser.email,
    createdAt: matchedUser.created_at,
  };
}
