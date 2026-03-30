"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import {
  availableLanguages,
  getLoginCopy,
  getStoredLanguage,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import { loginFields, LoginValidationError, loginUser } from "@/functions/login";

export default function LoginPage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
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
      await loginUser({
        login: String(formData.get(loginFields.login.name) ?? ""),
        password: String(formData.get(loginFields.password.name) ?? ""),
      });

      form.reset();
      setMessage(copy.success);
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
          <label className="auth-field" htmlFor={loginFields.login.id}>
            <span>{copy.loginLabel}</span>
            <input
              id={loginFields.login.id}
              name={loginFields.login.name}
              type="text"
              placeholder={copy.loginPlaceholder}
              autoComplete="username"
            />
          </label>

          <label className="auth-field" htmlFor={loginFields.password.id}>
            <span>{copy.passwordLabel}</span>
            <input
              id={loginFields.password.id}
              name={loginFields.password.name}
              type="password"
              placeholder={copy.passwordPlaceholder}
              autoComplete="current-password"
            />
          </label>

          {message ? <p className="auth-message auth-message-success">{message}</p> : null}
          {errorMessage ? (
            <p className="auth-message auth-message-error">{errorMessage}</p>
          ) : null}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.submitting : copy.submit}
          </button>

          <Link className="auth-secondary-link" href="/registration">
            {copy.alternateAction}
          </Link>
        </form>
      </section>
    </main>
  );
}
