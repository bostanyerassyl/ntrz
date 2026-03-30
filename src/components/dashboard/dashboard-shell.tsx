import Link from "next/link";
import type { ReactNode } from "react";

import {
  availableLanguages,
  type LanguageCode,
} from "@/functions/language";

export type DashboardMenuGroup = {
  key: string;
  label: string;
  items: Array<{
    href: string;
    label: string;
  }>;
};

type DashboardShellProps = {
  title: string;
  description: string;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  onLogout: () => void;
  logoutLabel: string;
  activeMenu: string | null;
  onToggleMenu: (menuKey: string) => void;
  menuGroups: DashboardMenuGroup[];
  footerRegistrationLabel: string;
  footerLoginLabel: string;
  children: ReactNode;
};

export function DashboardShell({
  title,
  description,
  language,
  onLanguageChange,
  onLogout,
  logoutLabel,
  activeMenu,
  onToggleMenu,
  menuGroups,
  footerRegistrationLabel,
  footerLoginLabel,
  children,
}: DashboardShellProps) {
  return (
    <main className="student-page">
      <div className="student-shell">
        <header className="student-topbar">
          <div className="student-brand-block">
            <span className="student-kicker">Aqbobek Lyceum</span>
            <div>
              <h1 className="student-brand-title">{title}</h1>
              <p className="student-brand-copy">{description}</p>
            </div>
          </div>

          <div className="student-topbar-actions">
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
            <button className="student-logout" type="button" onClick={onLogout}>
              {logoutLabel}
            </button>
          </div>
        </header>

        <nav className="student-menu-bar">
          {menuGroups.map((group) => (
            <div key={group.key} className="student-menu-group">
              <button
                className="student-menu-trigger"
                type="button"
                onClick={() => onToggleMenu(group.key)}
              >
                {group.label}
              </button>
              {activeMenu === group.key ? (
                <div className="student-menu-popover">
                  {group.items.map((item) => (
                    <a key={item.href} href={item.href}>
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        {children}

        <div className="student-footer-links">
          <Link href="/registration">{footerRegistrationLabel}</Link>
          <Link href="/login">{footerLoginLabel}</Link>
        </div>
      </div>
    </main>
  );
}
