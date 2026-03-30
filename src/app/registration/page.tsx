"use client";

import { FormEvent, useEffect, useState } from "react";

import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthStatusMessages } from "@/components/auth/auth-status-messages";
import { AuthTextField } from "@/components/auth/auth-text-field";
import {
  getRegistrationCopy,
  getStoredLanguage,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import {
  registerUser,
  registrationFields,
  RegistrationValidationError,
} from "@/functions/registration";

export default function RegistrationPage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy = getRegistrationCopy(language);

  useEffect(() => {
    setLanguage(getStoredLanguage());
  }, []);

  function handleLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
    setMessage(null);
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      await registerUser({
        login: String(formData.get(registrationFields.login.name) ?? ""),
        email: String(formData.get(registrationFields.email.name) ?? ""),
        password: String(formData.get(registrationFields.password.name) ?? ""),
      });

      form.reset();
      setMessage(copy.success);
    } catch (error) {
      const nextError =
        error instanceof RegistrationValidationError
          ? {
              login_required: copy.errors.loginRequired,
              email_required: copy.errors.emailRequired,
              password_required: copy.errors.passwordRequired,
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
      secondaryHref="/login"
      secondaryLabel={copy.alternateAction}
    >
      <AuthTextField
        id={registrationFields.login.id}
        name={registrationFields.login.name}
        label={copy.loginLabel}
        placeholder={copy.loginPlaceholder}
        autoComplete="username"
      />

      <AuthTextField
        id={registrationFields.email.id}
        name={registrationFields.email.name}
        label={copy.emailLabel}
        type="email"
        placeholder={copy.emailPlaceholder}
        autoComplete="email"
      />

      <AuthPasswordField
        id={registrationFields.password.id}
        name={registrationFields.password.name}
        label={copy.passwordLabel}
        placeholder={copy.passwordPlaceholder}
        autoComplete="new-password"
        isVisible={isPasswordVisible}
        showLabel={copy.showPassword}
        hideLabel={copy.hidePassword}
        onToggleVisibility={() => setIsPasswordVisible((current) => !current)}
      />

      <AuthStatusMessages successMessage={message} errorMessage={errorMessage} />
    </AuthShell>
  );
}
