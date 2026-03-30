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
    showPassword: "Show",
    hidePassword: "Hide",
    submit: "Register",
    submitting: "Registering...",
    success: "Registration data was saved to Supabase.",
    alternateAction: "If already registered, log in",
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
    showPassword: "Показать",
    hidePassword: "Скрыть",
    submit: "Зарегистрироваться",
    submitting: "Регистрация...",
    success: "Данные регистрации сохранены в Supabase.",
    alternateAction: "Если уже зарегистрированы, войдите",
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
    showPassword: "Көрсету",
    hidePassword: "Жасыру",
    submit: "Тіркелу",
    submitting: "Тіркелуде...",
    success: "Тіркеу деректері Supabase базасына сақталды.",
    alternateAction: "Егер тіркелген болсаңыз, кіріңіз",
    errors: {
      loginRequired: "Логин міндетті.",
      emailRequired: "Email міндетті.",
      passwordRequired: "Құпиясөз міндетті.",
      fallback: "Тіркеу сәтсіз аяқталды.",
    },
  },
} as const;

export const loginTranslations = {
  en: {
    kicker: "Aqbobek Lyceum",
    title: "Log in to your portal account",
    description:
      "Enter the data you used during registration. The system will compare it with the records stored in Supabase.",
    loginLabel: "Login",
    loginPlaceholder: "Enter your login",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show",
    hidePassword: "Hide",
    submit: "Log in",
    submitting: "Logging in...",
    success: "Login successful.",
    alternateAction: "Need an account? Register",
    errors: {
      loginRequired: "Login is required.",
      passwordRequired: "Password is required.",
      invalidCredentials: "Login or password is incorrect.",
      fallback: "Login failed.",
    },
  },
  ru: {
    kicker: "Aqbobek Lyceum",
    title: "Войдите в аккаунт портала",
    description:
      "Введите данные, которые использовали при регистрации. Система сравнит их с записями в Supabase.",
    loginLabel: "Логин",
    loginPlaceholder: "Введите логин",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Введите пароль",
    showPassword: "Показать",
    hidePassword: "Скрыть",
    submit: "Войти",
    submitting: "Вход...",
    success: "Вход выполнен успешно.",
    alternateAction: "Нужен аккаунт? Зарегистрируйтесь",
    errors: {
      loginRequired: "Логин обязателен.",
      passwordRequired: "Пароль обязателен.",
      invalidCredentials: "Логин или пароль неверный.",
      fallback: "Не удалось выполнить вход.",
    },
  },
  kk: {
    kicker: "Aqbobek Lyceum",
    title: "Портал аккаунтына кіріңіз",
    description:
      "Тіркелу кезінде енгізген деректерді жазыңыз. Жүйе оларды Supabase-тағы жазбалармен салыстырады.",
    loginLabel: "Логин",
    loginPlaceholder: "Логиніңізді енгізіңіз",
    passwordLabel: "Құпиясөз",
    passwordPlaceholder: "Құпиясөзіңізді енгізіңіз",
    showPassword: "Көрсету",
    hidePassword: "Жасыру",
    submit: "Кіру",
    submitting: "Кіруде...",
    success: "Кіру сәтті аяқталды.",
    alternateAction: "Аккаунт керек пе? Тіркеліңіз",
    errors: {
      loginRequired: "Логин міндетті.",
      passwordRequired: "Құпиясөз міндетті.",
      invalidCredentials: "Логин немесе құпиясөз қате.",
      fallback: "Кіру сәтсіз аяқталды.",
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

export function getLoginCopy(language: LanguageCode) {
  return loginTranslations[language];
}
