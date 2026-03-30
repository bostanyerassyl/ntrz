import { supabase } from "@/functions/supabase";

export const registrationFields = {
  login: {
    id: "register-login",
    name: "login",
  },
  password: {
    id: "register-password",
    name: "password",
  },
  email: {
    id: "register-email",
    name: "email",
  },
} as const;

export type RegistrationInput = {
  login: string;
  password: string;
  email: string;
};

export type RegistrationRecord = RegistrationInput & {
  createdAt: string;
};

export class RegistrationValidationError extends Error {
  constructor(
    public readonly code:
      | "login_required"
      | "email_required"
      | "password_required",
  ) {
    super(code);
    this.name = "RegistrationValidationError";
  }
}

export function normalizeRegistrationInput(
  input: RegistrationInput,
): RegistrationInput {
  return {
    login: input.login.trim(),
    password: input.password.trim(),
    email: input.email.trim().toLowerCase(),
  };
}

export function validateRegistrationInput(
  input: RegistrationInput,
): RegistrationInput {
  const normalizedInput = normalizeRegistrationInput(input);

  if (!normalizedInput.login) {
    throw new RegistrationValidationError("login_required");
  }

  if (!normalizedInput.email) {
    throw new RegistrationValidationError("email_required");
  }

  if (!normalizedInput.password) {
    throw new RegistrationValidationError("password_required");
  }

  return normalizedInput;
}

export function createRegistrationRecord(
  input: RegistrationInput,
): RegistrationRecord {
  const validatedInput = validateRegistrationInput(input);

  return {
    ...validatedInput,
    createdAt: new Date().toISOString(),
  };
}

export async function createPasswordHash(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerUser(input: RegistrationInput) {
  const registrationRecord = createRegistrationRecord(input);
  const passwordHash = await createPasswordHash(registrationRecord.password);

  const { error } = await supabase.from("registrations").insert({
    login: registrationRecord.login,
    email: registrationRecord.email,
    password_hash: passwordHash,
    created_at: registrationRecord.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  return registrationRecord;
}
