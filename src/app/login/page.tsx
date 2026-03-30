"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import {
  availableLanguages,
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

      if (loggedInUser.role === "student") {
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
    <main className="auth-page" data-user-role={userRole ?? ""}>
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
            <div className="password-input-wrap">
              <input
                id={loginFields.password.id}
                name={loginFields.password.name}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={copy.passwordPlaceholder}
                autoComplete="current-password"
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

          <Link className="auth-secondary-link" href="/registration">
            {copy.alternateAction}
          </Link>
        </form>
      </section>
    </main>
  );
}
