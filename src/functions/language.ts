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

export const studentPortalTranslations = {
  en: {
    topMe: "Me",
    topSchool: "School",
    topProfile: "Profile",
    topGrades: "Grades",
    topTimetable: "Timetable",
    topSchoolNews: "News",
    topTeacherSchedules: "Teachers",
    topClassSchedules: "Classes",
    topRating: "Rating",
    pageTitle: "Student dashboard",
    pageDescription:
      "A single workspace for profile details, current marks, today's lessons, school schedules, and private rating movement.",
    heroNewsTitle: "School news",
    heroNewsDescription: "News feed block is prepared. Content will come from the database later.",
    heroScheduleTitle: "Today's timetable",
    heroGradesTitle: "Recent grades",
    heroRatingTitle: "Private rating",
    profileTitle: "Student profile",
    profileDescription:
      "Personal account data is loaded from the database. The original password cannot be shown because only the secure hash is stored.",
    profileLogin: "Login",
    profileEmail: "Email",
    profileRole: "Role",
    profilePassword: "Stored password hash",
    profileShowHash: "Show hash",
    profileHideHash: "Hide hash",
    gradesTitle: "Grades by subject",
    gradesDescription:
      "Marks are shown in a compact table. If there is no grade for a lesson yet, the dashboard will simply show a dash.",
    gradesSubject: "Subject",
    gradesLesson: "Lesson",
    gradesMark: "Mark",
    gradesDate: "Date",
    timetableTitle: "Today's schedule",
    timetableDescription: "Daily lessons are shown in order. Empty cells mean nothing is scheduled yet.",
    timetableTime: "Time",
    timetableTeacher: "Teacher",
    timetableClassroom: "Classroom",
    schoolNewsTitle: "News block",
    schoolNewsDescription:
      "School news section is reserved in the layout, but database logic for news is intentionally not added yet.",
    teacherSchedulesTitle: "Teacher schedules",
    classSchedulesTitle: "Class schedules",
    scheduleTeacher: "Teacher",
    scheduleClass: "Class",
    scheduleSubject: "Subject",
    scheduleRoom: "Room",
    ratingTitle: "School rating",
    ratingDescription:
      "Rating hides raw grades and shows only a calculated score. The formula is intentionally not obvious to other students.",
    ratingPlace: "Place",
    ratingStudent: "Student",
    ratingScore: "Score",
    loading: "Loading dashboard...",
    emptyState: "No data yet",
  },
  ru: {
    topMe: "Я",
    topSchool: "Школа",
    topProfile: "Профиль",
    topGrades: "Оценки",
    topTimetable: "Расписание",
    topSchoolNews: "Новости",
    topTeacherSchedules: "Учителя",
    topClassSchedules: "Классы",
    topRating: "Рейтинг",
    pageTitle: "Панель ученика",
    pageDescription:
      "Единое пространство для профиля, текущих оценок, сегодняшних уроков, школьных расписаний и приватного рейтинга.",
    heroNewsTitle: "Новости школы",
    heroNewsDescription: "Блок новостей уже подготовлен. Контент позже будет приходить из базы данных.",
    heroScheduleTitle: "Расписание на сегодня",
    heroGradesTitle: "Последние оценки",
    heroRatingTitle: "Приватный рейтинг",
    profileTitle: "Профиль ученика",
    profileDescription:
      "Данные аккаунта загружаются из базы. Исходный пароль показать нельзя, потому что хранится только безопасный хеш.",
    profileLogin: "Логин",
    profileEmail: "Email",
    profileRole: "Роль",
    profilePassword: "Сохраненный хеш пароля",
    profileShowHash: "Показать хеш",
    profileHideHash: "Скрыть хеш",
    gradesTitle: "Оценки по предметам",
    gradesDescription:
      "Оценки показаны в компактной таблице. Если за урок еще нет оценки, на панели будет просто тире.",
    gradesSubject: "Предмет",
    gradesLesson: "Урок",
    gradesMark: "Оценка",
    gradesDate: "Дата",
    timetableTitle: "Сегодняшнее расписание",
    timetableDescription: "Уроки идут по порядку. Пустые ячейки означают, что пока ничего не назначено.",
    timetableTime: "Время",
    timetableTeacher: "Учитель",
    timetableClassroom: "Кабинет",
    schoolNewsTitle: "Блок новостей",
    schoolNewsDescription:
      "Секция новостей уже заложена в интерфейс, но логика базы данных для новостей пока намеренно не добавлена.",
    teacherSchedulesTitle: "Расписания учителей",
    classSchedulesTitle: "Расписания классов",
    scheduleTeacher: "Учитель",
    scheduleClass: "Класс",
    scheduleSubject: "Предмет",
    scheduleRoom: "Кабинет",
    ratingTitle: "Школьный рейтинг",
    ratingDescription:
      "Рейтинг не показывает сырые оценки, а выводит только вычисленный балл. Формула специально неочевидна для других учеников.",
    ratingPlace: "Место",
    ratingStudent: "Ученик",
    ratingScore: "Баллы",
    loading: "Загрузка панели...",
    emptyState: "Данных пока нет",
  },
  kk: {
    topMe: "Мен",
    topSchool: "Мектеп",
    topProfile: "Профиль",
    topGrades: "Бағалар",
    topTimetable: "Кесте",
    topSchoolNews: "Жаңалықтар",
    topTeacherSchedules: "Мұғалімдер",
    topClassSchedules: "Сыныптар",
    topRating: "Рейтинг",
    pageTitle: "Оқушы панелі",
    pageDescription:
      "Профиль, ағымдағы бағалар, бүгінгі сабақтар, мектеп кестелері және жеке рейтинг бір жерде жиналады.",
    heroNewsTitle: "Мектеп жаңалықтары",
    heroNewsDescription:
      "Жаңалықтар блогы дайын. Контент кейін база арқылы қосылады.",
    heroScheduleTitle: "Бүгінгі кесте",
    heroGradesTitle: "Соңғы бағалар",
    heroRatingTitle: "Жеке рейтинг",
    profileTitle: "Оқушы профилі",
    profileDescription:
      "Аккаунт деректері базадан оқылады. Бастапқы құпиясөзді көрсету мүмкін емес, себебі тек қауіпсіз хеш сақталады.",
    profileLogin: "Логин",
    profileEmail: "Email",
    profileRole: "Рөл",
    profilePassword: "Сақталған құпиясөз хеші",
    profileShowHash: "Хешті көрсету",
    profileHideHash: "Хешті жасыру",
    gradesTitle: "Пәндер бойынша бағалар",
    gradesDescription:
      "Бағалар ықшам кестеде көрсетіледі. Егер сабаққа баға әлі қойылмаса, сызықша көрсетіледі.",
    gradesSubject: "Пән",
    gradesLesson: "Сабақ",
    gradesMark: "Баға",
    gradesDate: "Күні",
    timetableTitle: "Бүгінгі сабақ кестесі",
    timetableDescription:
      "Сабақтар ретімен көрсетіледі. Бос ұяшықтар әзірге жоспар жоқ екенін білдіреді.",
    timetableTime: "Уақыты",
    timetableTeacher: "Мұғалім",
    timetableClassroom: "Кабинет",
    schoolNewsTitle: "Жаңалықтар блогы",
    schoolNewsDescription:
      "Жаңалықтар бөлігі интерфейсте дайын, бірақ база логикасы әзірше әдейі қосылмаған.",
    teacherSchedulesTitle: "Мұғалімдер кестесі",
    classSchedulesTitle: "Сыныптар кестесі",
    scheduleTeacher: "Мұғалім",
    scheduleClass: "Сынып",
    scheduleSubject: "Пән",
    scheduleRoom: "Кабинет",
    ratingTitle: "Мектеп рейтингі",
    ratingDescription:
      "Рейтинг нақты бағаларды көрсетпейді, тек есептелген ұпайды шығарады. Формула басқа оқушыларға түсініксіз етіп жасалған.",
    ratingPlace: "Орын",
    ratingStudent: "Оқушы",
    ratingScore: "Ұпай",
    loading: "Панель жүктелуде...",
    emptyState: "Әзірге дерек жоқ",
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

export function getStudentPortalCopy(language: LanguageCode) {
  return studentPortalTranslations[language];
}
