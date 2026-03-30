"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthStatusMessages } from "@/components/auth/auth-status-messages";
import { AuthTextField } from "@/components/auth/auth-text-field";
import {
  getLoginCopy,
  getStoredLanguage,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import { getRoleHomeRoute, type UserRole } from "@/functions/permissions";
import { loginFields, LoginValidationError, loginUser } from "@/functions/login";
import { setStoredUserSession } from "@/functions/user-session";

export default function LoginPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy = getLoginCopy(language);

  useEffect(() => {
    setLanguage(getStoredLanguage());
  }, []);

  function handleLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
    setUserRole(null);
    setMessage(null);
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setUserRole(null);
    setMessage(null);
    setErrorMessage(null);

    try {
      const loggedInUser = await loginUser({
        login: String(formData.get(loginFields.login.name) ?? ""),
        password: String(formData.get(loginFields.password.name) ?? ""),
      });

      setUserRole(loggedInUser.role);
      setStoredUserSession(loggedInUser);
      form.reset();
      setMessage(copy.success);

      if (loggedInUser.role === "student" || loggedInUser.role === "teacher") {
        router.push(getRoleHomeRoute(loggedInUser.role));
      }
    } catch (error) {
      const nextError =
        error instanceof LoginValidationError
          ? {
              login_required: copy.errors.loginRequired,
              password_required: copy.errors.passwordRequired,
              invalid_credentials: copy.errors.invalidCredentials,
            }[error.code]
          : error instanceof Error
            ? error.message
            : copy.errors.fallback;

      setErrorMessage(nextError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      language={language}
      onLanguageChange={handleLanguageChange}
      kicker={copy.kicker}
      title={copy.title}
      description={copy.description}
      onSubmit={handleSubmit}
      submitLabel={isSubmitting ? copy.submitting : copy.submit}
      isSubmitting={isSubmitting}
      secondaryHref="/registration"
      secondaryLabel={copy.alternateAction}
      dataUserRole={userRole ?? ""}
    >
      <AuthTextField
        id={loginFields.login.id}
        name={loginFields.login.name}
        label={copy.loginLabel}
        placeholder={copy.loginPlaceholder}
        autoComplete="username"
      />

      <AuthPasswordField
        id={loginFields.password.id}
        name={loginFields.password.name}
        label={copy.passwordLabel}
        placeholder={copy.passwordPlaceholder}
        autoComplete="current-password"
        isVisible={isPasswordVisible}
        showLabel={copy.showPassword}
        hideLabel={copy.hidePassword}
        onToggleVisibility={() => setIsPasswordVisible((current) => !current)}
      />

      <AuthStatusMessages successMessage={message} errorMessage={errorMessage} />
    </AuthShell>
  );
}
