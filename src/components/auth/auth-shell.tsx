import Link from "next/link";
import type { FormEvent, ReactNode } from "react";

import { availableLanguages, type LanguageCode } from "@/functions/language";

type AuthShellProps = {
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  kicker: string;
  title: string;
  description: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  isSubmitting: boolean;
  secondaryHref: string;
  secondaryLabel: string;
  children: ReactNode;
  dataUserRole?: string;
};

export function AuthShell({
  language,
  onLanguageChange,
  kicker,
  title,
  description,
  onSubmit,
  submitLabel,
  isSubmitting,
  secondaryHref,
  secondaryLabel,
  children,
  dataUserRole,
}: AuthShellProps) {
  return (
    <main className="auth-page" data-user-role={dataUserRole ?? ""}>
      <section className="auth-panel">
        <div className="auth-copy">
          <div className="auth-toolbar">
            <span className="auth-kicker">{kicker}</span>
            <div className="language-switcher" aria-label="Language switcher">
              {availableLanguages.map((item) => (
                <button
                  key={item.code}
                  className={`language-switcher-button${
                    language === item.code ? " is-active" : ""
                  }`}
                  type="button"
                  onClick={() => onLanguageChange(item.code)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {children}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {submitLabel}
          </button>

          <Link className="auth-secondary-link" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </form>
      </section>
    </main>
  );
}
