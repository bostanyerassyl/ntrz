"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import {
  availableLanguages,
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
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <div className="auth-toolbar">
            <span className="auth-kicker">{copy.kicker}</span>
            <div className="language-switcher" aria-label="Language switcher">
              {availableLanguages.map((item) => (
                <button
                  key={item.code}
                  className={`language-switcher-button${
                    language === item.code ? " is-active" : ""
                  }`}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor={registrationFields.login.id}>
            <span>{copy.loginLabel}</span>
            <input
              id={registrationFields.login.id}
              name={registrationFields.login.name}
              type="text"
              placeholder={copy.loginPlaceholder}
              autoComplete="username"
            />
          </label>

          <label className="auth-field" htmlFor={registrationFields.email.id}>
            <span>{copy.emailLabel}</span>
            <input
              id={registrationFields.email.id}
              name={registrationFields.email.name}
              type="email"
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
            />
          </label>

          <label className="auth-field" htmlFor={registrationFields.password.id}>
            <span>{copy.passwordLabel}</span>
            <div className="password-input-wrap">
              <input
                id={registrationFields.password.id}
                name={registrationFields.password.name}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={copy.passwordPlaceholder}
                autoComplete="new-password"
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                {isPasswordVisible ? copy.hidePassword : copy.showPassword}
              </button>
            </div>
          </label>

          {message ? <p className="auth-message auth-message-success">{message}</p> : null}
          {errorMessage ? (
            <p className="auth-message auth-message-error">{errorMessage}</p>
          ) : null}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.submitting : copy.submit}
          </button>

          <Link className="auth-secondary-link" href="/login">
            {copy.alternateAction}
          </Link>
        </form>
      </section>
    </main>
  );
}
