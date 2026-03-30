"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  availableLanguages,
  getStoredLanguage,
  getStudentPortalCopy,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import {
  getClassSchedules,
  getStudentGrades,
  getStudentLeaderboard,
  getStudentProfile,
  getStudentTodaySchedule,
  getTeacherSchedules,
  type ClassScheduleEntry,
  type StudentGrade,
  type StudentLeaderboardEntry,
  type StudentProfile,
  type StudentScheduleEntry,
  type TeacherScheduleEntry,
} from "@/functions/student-portal";
import {
  clearStoredUserSession,
  getStoredUserSession,
  type StoredUserSession,
} from "@/functions/user-session";

type StudentDashboardState = {
  profile: StudentProfile | null;
  grades: StudentGrade[];
  todaySchedule: StudentScheduleEntry[];
  teacherSchedules: TeacherScheduleEntry[];
  classSchedules: ClassScheduleEntry[];
  leaderboard: StudentLeaderboardEntry[];
};

const initialDashboardState: StudentDashboardState = {
  profile: null,
  grades: [],
  todaySchedule: [],
  teacherSchedules: [],
  classSchedules: [],
  leaderboard: [],
};

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateString: string | null) {
  if (!dateString) {
    return "-";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function formatTimeRange(startTime: string, endTime: string) {
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
}

export default function StudentPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [userSession, setUserSession] = useState<StoredUserSession | null>(null);
  const [dashboardState, setDashboardState] =
    useState<StudentDashboardState>(initialDashboardState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<"me" | "school" | null>(null);
  const [isHashVisible, setIsHashVisible] = useState(false);

  const copy = getStudentPortalCopy(language);
  const lessonDate = useMemo(() => getLocalDateString(), []);

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    const storedSession = getStoredUserSession();

    setLanguage(storedLanguage);
    setUserSession(storedSession);

    if (!storedSession) {
      router.push("/login");
      return;
    }

    async function loadStudentDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [profile, grades, todaySchedule, teacherSchedules, classSchedules, leaderboard] =
          await Promise.all([
            getStudentProfile(storedSession.login),
            getStudentGrades(storedSession.login),
            getStudentTodaySchedule(storedSession.login, lessonDate),
            getTeacherSchedules(lessonDate),
            getClassSchedules(lessonDate),
            getStudentLeaderboard(),
          ]);

        setDashboardState({
          profile,
          grades,
          todaySchedule,
          teacherSchedules,
          classSchedules,
          leaderboard,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load student dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudentDashboard();
  }, [lessonDate, router]);

  function handleLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
  }

  function handleLogout() {
    clearStoredUserSession();
    router.push("/login");
  }

  const latestGrades = dashboardState.grades.slice(0, 4);
  const topLeaderboard = dashboardState.leaderboard.slice(0, 8);

  return (
    <main className="student-page">
      <div className="student-shell">
        <header className="student-topbar">
          <div className="student-brand-block">
            <span className="student-kicker">Aqbobek Lyceum</span>
            <div>
              <h1 className="student-brand-title">{copy.pageTitle}</h1>
              <p className="student-brand-copy">{copy.pageDescription}</p>
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
                  onClick={() => handleLanguageChange(item.code)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button className="student-logout" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <nav className="student-menu-bar">
          <div className="student-menu-group">
            <button
              className="student-menu-trigger"
              type="button"
              onClick={() => setActiveMenu((current) => (current === "me" ? null : "me"))}
            >
              {copy.topMe}
            </button>
            {activeMenu === "me" ? (
              <div className="student-menu-popover">
                <a href="#student-profile">{copy.topProfile}</a>
                <a href="#student-grades">{copy.topGrades}</a>
                <a href="#student-schedule">{copy.topTimetable}</a>
              </div>
            ) : null}
          </div>

          <div className="student-menu-group">
            <button
              className="student-menu-trigger"
              type="button"
              onClick={() =>
                setActiveMenu((current) => (current === "school" ? null : "school"))
              }
            >
              {copy.topSchool}
            </button>
            {activeMenu === "school" ? (
              <div className="student-menu-popover">
                <a href="#school-news">{copy.topSchoolNews}</a>
                <a href="#teacher-schedules">{copy.topTeacherSchedules}</a>
                <a href="#class-schedules">{copy.topClassSchedules}</a>
                <a href="#student-rating">{copy.topRating}</a>
              </div>
            ) : null}
          </div>
        </nav>

        {isLoading ? (
          <section className="student-loading-panel">{copy.loading}</section>
        ) : (
          <>
            {errorMessage ? (
              <section className="student-error-panel">{errorMessage}</section>
            ) : null}

            <section className="student-hero-grid">
              <article className="student-card student-card-news" id="school-news">
                <p className="student-card-label">{copy.heroNewsTitle}</p>
                <h2>{copy.heroNewsTitle}</h2>
                <p>{copy.heroNewsDescription}</p>
                <div className="student-news-mini-grid">
                  <div className="student-news-mini-card">
                    <strong>{copy.heroNewsTitle}</strong>
                    <span>{copy.emptyState}</span>
                  </div>
                  <div className="student-news-mini-card">
                    <strong>{copy.topSchool}</strong>
                    <span>{copy.emptyState}</span>
                  </div>
                </div>
              </article>

              <article className="student-card">
                <p className="student-card-label">{copy.heroScheduleTitle}</p>
                <h2>{copy.heroScheduleTitle}</h2>
                <div className="student-mini-list">
                  {dashboardState.todaySchedule.length ? (
                    dashboardState.todaySchedule.slice(0, 4).map((item) => (
                      <div key={item.id} className="student-mini-list-item">
                        <strong>{item.subject_name}</strong>
                        <span>{formatTimeRange(item.start_time, item.end_time)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="student-empty-line">{copy.emptyState}</div>
                  )}
                </div>
              </article>

              <article className="student-card">
                <p className="student-card-label">{copy.heroGradesTitle}</p>
                <h2>{copy.heroGradesTitle}</h2>
                <div className="student-mini-list">
                  {latestGrades.length ? (
                    latestGrades.map((item) => (
                      <div key={item.id} className="student-mini-list-item">
                        <strong>{item.subject_name ?? copy.emptyState}</strong>
                        <span>{item.mark_value ?? "-"}</span>
                      </div>
                    ))
                  ) : (
                    <div className="student-empty-line">{copy.emptyState}</div>
                  )}
                </div>
              </article>

              <article className="student-card student-card-rating">
                <p className="student-card-label">{copy.heroRatingTitle}</p>
                <h2>{copy.heroRatingTitle}</h2>
                <p className="student-rating-value">
                  {topLeaderboard.find((item) => item.login === userSession?.login)?.rating ??
                    "-"}
                </p>
              </article>
            </section>

            <section className="student-content-grid">
              <div className="student-content-main">
                <section className="student-card" id="student-profile">
                  <div className="student-section-heading">
                    <div>
                      <p className="student-card-label">{copy.topProfile}</p>
                      <h2>{copy.profileTitle}</h2>
                    </div>
                    <p>{copy.profileDescription}</p>
                  </div>

                  <div className="student-profile-grid">
                    <div className="student-profile-item">
                      <span>{copy.profileLogin}</span>
                      <strong>{dashboardState.profile?.login ?? userSession?.login ?? "-"}</strong>
                    </div>
                    <div className="student-profile-item">
                      <span>{copy.profileEmail}</span>
                      <strong>{dashboardState.profile?.email ?? userSession?.email ?? "-"}</strong>
                    </div>
                    <div className="student-profile-item">
                      <span>{copy.profileRole}</span>
                      <strong>{dashboardState.profile?.role ?? userSession?.role ?? "-"}</strong>
                    </div>
                    <div className="student-profile-item">
                      <span>{copy.profilePassword}</span>
                      <div className="student-password-hash">
                        <strong>
                          {isHashVisible
                            ? dashboardState.profile?.passwordHash ?? "-"
                            : "********************"}
                        </strong>
                        <button
                          className="student-inline-button"
                          type="button"
                          onClick={() => setIsHashVisible((current) => !current)}
                        >
                          {isHashVisible ? copy.profileHideHash : copy.profileShowHash}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="student-card" id="student-grades">
                  <div className="student-section-heading">
                    <div>
                      <p className="student-card-label">{copy.topGrades}</p>
                      <h2>{copy.gradesTitle}</h2>
                    </div>
                    <p>{copy.gradesDescription}</p>
                  </div>

                  <div className="student-table-wrap">
                    <table className="student-table">
                      <thead>
                        <tr>
                          <th>{copy.gradesSubject}</th>
                          <th>{copy.gradesLesson}</th>
                          <th>{copy.gradesMark}</th>
                          <th>{copy.gradesDate}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.grades.length ? (
                          dashboardState.grades.map((grade) => (
                            <tr key={grade.id}>
                              <td>{grade.subject_name ?? "-"}</td>
                              <td>{grade.lesson_name ?? "-"}</td>
                              <td>{grade.mark_value ?? "-"}</td>
                              <td>{formatDateLabel(grade.mark_date)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="student-card" id="student-schedule">
                  <div className="student-section-heading">
                    <div>
                      <p className="student-card-label">{copy.topTimetable}</p>
                      <h2>{copy.timetableTitle}</h2>
                    </div>
                    <p>{copy.timetableDescription}</p>
                  </div>

                  <div className="student-table-wrap">
                    <table className="student-table">
                      <thead>
                        <tr>
                          <th>{copy.timetableTime}</th>
                          <th>{copy.gradesSubject}</th>
                          <th>{copy.timetableTeacher}</th>
                          <th>{copy.timetableClassroom}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.todaySchedule.length ? (
                          dashboardState.todaySchedule.map((item) => (
                            <tr key={item.id}>
                              <td>{formatTimeRange(item.start_time, item.end_time)}</td>
                              <td>{item.subject_name}</td>
                              <td>{item.teacher_name}</td>
                              <td>{item.classroom ?? "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <aside className="student-content-side">
                <section className="student-card" id="teacher-schedules">
                  <div className="student-section-heading">
                    <div>
                      <p className="student-card-label">{copy.topTeacherSchedules}</p>
                      <h2>{copy.teacherSchedulesTitle}</h2>
                    </div>
                  </div>

                  <div className="student-table-wrap">
                    <table className="student-table student-table-compact">
                      <thead>
                        <tr>
                          <th>{copy.scheduleTeacher}</th>
                          <th>{copy.scheduleSubject}</th>
                          <th>{copy.scheduleClass}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.teacherSchedules.length ? (
                          dashboardState.teacherSchedules.map((item) => (
                            <tr key={item.id}>
                              <td>{item.teacher_name}</td>
                              <td>{item.subject_name}</td>
                              <td>{item.class_name}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="student-card" id="class-schedules">
                  <div className="student-section-heading">
                    <div>
                      <p className="student-card-label">{copy.topClassSchedules}</p>
                      <h2>{copy.classSchedulesTitle}</h2>
                    </div>
                  </div>

                  <div className="student-table-wrap">
                    <table className="student-table student-table-compact">
                      <thead>
                        <tr>
                          <th>{copy.scheduleClass}</th>
                          <th>{copy.scheduleSubject}</th>
                          <th>{copy.scheduleTeacher}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.classSchedules.length ? (
                          dashboardState.classSchedules.map((item) => (
                            <tr key={item.id}>
                              <td>{item.class_name}</td>
                              <td>{item.subject_name}</td>
                              <td>{item.teacher_name}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="student-card" id="student-rating">
                  <div className="student-section-heading">
                    <div>
                      <p className="student-card-label">{copy.topRating}</p>
                      <h2>{copy.ratingTitle}</h2>
                    </div>
                    <p>{copy.ratingDescription}</p>
                  </div>

                  <div className="student-table-wrap">
                    <table className="student-table student-table-compact">
                      <thead>
                        <tr>
                          <th>{copy.ratingPlace}</th>
                          <th>{copy.ratingStudent}</th>
                          <th>{copy.ratingScore}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topLeaderboard.length ? (
                          topLeaderboard.map((item, index) => (
                            <tr key={item.login}>
                              <td>{index + 1}</td>
                              <td>{item.maskedLogin}</td>
                              <td>{item.rating}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </aside>
            </section>
          </>
        )}

        <div className="student-footer-links">
          <Link href="/registration">Registration</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </main>
  );
}
