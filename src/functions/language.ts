export type LanguageCode = "en" | "ru" | "kk";

export const languageStorageKey = "portal-language";

export const availableLanguages: Array<{
  code: LanguageCode;
  label: string;
}> = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "kk", label: "KZ" },
];

export const registrationTranslations = {
  en: {
    kicker: "Aqbobek Lyceum",
    title: "Create your portal account",
    description:
      "Start with a clean registration flow. This page is now the default screen that opens when the project runs.",
    loginLabel: "Login",
    loginPlaceholder: "Enter your login",
    emailLabel: "Email",
    emailPlaceholder: "name@aqbobek.edu",
    passwordLabel: "Password",
    passwordPlaceholder: "Create your password",
    submit: "Register",
    submitting: "Registering...",
    success: "Registration data was saved to Supabase.",
    errors: {
      loginRequired: "Login is required.",
      emailRequired: "Email is required.",
      passwordRequired: "Password is required.",
      fallback: "Registration failed.",
    },
  },
  ru: {
    kicker: "Aqbobek Lyceum",
    title: "Создайте аккаунт портала",
    description:
      "Начните с чистого сценария регистрации. Теперь эта страница открывается первой при запуске проекта.",
    loginLabel: "Логин",
    loginPlaceholder: "Введите логин",
    emailLabel: "Email",
    emailPlaceholder: "name@aqbobek.edu",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Создайте пароль",
    submit: "Зарегистрироваться",
    submitting: "Регистрация...",
    success: "Данные регистрации сохранены в Supabase.",
    errors: {
      loginRequired: "Логин обязателен.",
      emailRequired: "Email обязателен.",
      passwordRequired: "Пароль обязателен.",
      fallback: "Не удалось выполнить регистрацию.",
    },
  },
  kk: {
    kicker: "Aqbobek Lyceum",
    title: "Портал аккаунтын жасаңыз",
    description:
      "Тіркеу процесін осы беттен бастаңыз. Енді жоба іске қосылғанда алдымен осы бет ашылады.",
    loginLabel: "Логин",
    loginPlaceholder: "Логиніңізді енгізіңіз",
    emailLabel: "Email",
    emailPlaceholder: "name@aqbobek.edu",
    passwordLabel: "Құпиясөз",
    passwordPlaceholder: "Құпиясөз жасаңыз",
    submit: "Тіркелу",
    submitting: "Тіркелуде...",
    success: "Тіркеу деректері Supabase базасына сақталды.",
    errors: {
      loginRequired: "Логин міндетті.",
      emailRequired: "Email міндетті.",
      passwordRequired: "Құпиясөз міндетті.",
      fallback: "Тіркеу сәтсіз аяқталды.",
    },
  },
} as const;

export function isLanguageCode(value: string): value is LanguageCode {
  return availableLanguages.some((language) => language.code === value);
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);

  if (storedLanguage && isLanguageCode(storedLanguage)) {
    return storedLanguage;
  }

  return "en";
}

export function setStoredLanguage(language: LanguageCode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(languageStorageKey, language);
}

export function getRegistrationCopy(language: LanguageCode) {
  return registrationTranslations[language];
}
