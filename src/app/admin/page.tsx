"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardMiniListCard } from "@/components/dashboard/dashboard-mini-list-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardTableCard } from "@/components/dashboard/dashboard-table-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import {
  createSchoolNews,
  getAdminDashboardData,
  updateSchoolNews,
  type AdminClassScheduleEntry,
  type AdminGradeEntry,
  type AdminProfile,
  type AdminStudentScheduleEntry,
  type AdminTeacherScheduleEntry,
  type SchoolNewsEntry,
} from "@/functions/admin-portal";
import {
  getAdminPortalCopy,
  getStoredLanguage,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import { getRoleHomeRoute } from "@/functions/permissions";
import { type StudentLeaderboardEntry } from "@/functions/student-portal";
import {
  clearStoredUserSession,
  getStoredUserSession,
  type StoredUserSession,
} from "@/functions/user-session";

type AdminDashboardState = {
  profile: AdminProfile | null;
  grades: AdminGradeEntry[];
  studentSchedules: AdminStudentScheduleEntry[];
  teacherSchedules: AdminTeacherScheduleEntry[];
  classSchedules: AdminClassScheduleEntry[];
  leaderboard: StudentLeaderboardEntry[];
  news: SchoolNewsEntry[];
};

const initialDashboardState: AdminDashboardState = {
  profile: null,
  grades: [],
  studentSchedules: [],
  teacherSchedules: [],
  classSchedules: [],
  leaderboard: [],
  news: [],
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

function formatDateTimeLabel(dateString: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function formatTimeRange(startTime: string, endTime: string) {
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
}

export default function AdminPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [userSession, setUserSession] = useState<StoredUserSession | null>(null);
  const [dashboardState, setDashboardState] =
    useState<AdminDashboardState>(initialDashboardState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<"me" | "school" | null>(null);
  const [isHashVisible, setIsHashVisible] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSavingNews, setIsSavingNews] = useState(false);

  const copy = getAdminPortalCopy(language);
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

    if (storedSession.role !== "admin") {
      if (
        storedSession.role === "student" ||
        storedSession.role === "teacher" ||
        storedSession.role === "parent"
      ) {
        router.push(getRoleHomeRoute(storedSession.role));
        return;
      }

      router.push("/login");
      return;
    }

    const session = storedSession;

    async function loadAdminDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const adminData = await getAdminDashboardData(lessonDate, session.login);
        setDashboardState(adminData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load admin dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadAdminDashboard();
  }, [lessonDate, router]);

  function handleLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
  }

  function handleLogout() {
    clearStoredUserSession();
    router.push("/login");
  }

  function handleEditNews(entry: SchoolNewsEntry) {
    setEditingNewsId(entry.id);
    setNewsTitle(entry.title);
    setNewsContent(entry.content);
    setIsPublished(entry.is_published);
    setMessage(null);
    setErrorMessage(null);
  }

  async function handleNewsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userSession) {
      return;
    }

    setIsSavingNews(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const savedEntry = editingNewsId
        ? await updateSchoolNews(editingNewsId, {
            title: newsTitle,
            content: newsContent,
            isPublished,
          })
        : await createSchoolNews({
            title: newsTitle,
            content: newsContent,
            isPublished,
            adminLogin: userSession.login,
          });

      setDashboardState((current) => {
        const nextNews = editingNewsId
          ? current.news.map((item) => (item.id === savedEntry.id ? savedEntry : item))
          : [savedEntry, ...current.news];

        return {
          ...current,
          news: nextNews.sort((left, right) => right.updated_at.localeCompare(left.updated_at)),
        };
      });

      setEditingNewsId(null);
      setNewsTitle("");
      setNewsContent("");
      setIsPublished(false);
      setMessage(editingNewsId ? copy.successUpdate : copy.successCreate);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.errorFallback);
    } finally {
      setIsSavingNews(false);
    }
  }

  const topLeaderboard = dashboardState.leaderboard.slice(0, 8);
  const latestGrades = dashboardState.grades.slice(0, 4);
  const todayScheduleCount =
    dashboardState.studentSchedules.length +
    dashboardState.teacherSchedules.length +
    dashboardState.classSchedules.length;
  const menuGroups = [
    {
      key: "me",
      label: copy.topMe,
      items: [{ href: "#admin-profile", label: copy.topProfile }],
    },
    {
      key: "school",
      label: copy.topSchool,
      items: [
        { href: "#news-editor", label: copy.topNews },
        { href: "#all-grades", label: copy.topGrades },
        { href: "#student-schedules", label: copy.topSchedules },
        { href: "#school-rating", label: copy.topRating },
      ],
    },
  ];

  return (
    <DashboardShell
      title={copy.pageTitle}
      description={copy.pageDescription}
      language={language}
      onLanguageChange={handleLanguageChange}
      onLogout={handleLogout}
      logoutLabel={copy.logout}
      activeMenu={activeMenu}
      onToggleMenu={(menuKey) =>
        setActiveMenu((current) => (current === menuKey ? null : (menuKey as "me" | "school")))
      }
      menuGroups={menuGroups}
      footerRegistrationLabel={copy.registration}
      footerLoginLabel={copy.login}
    >
      {isLoading ? (
        <section className="student-loading-panel">{copy.loading}</section>
      ) : (
        <>
          {errorMessage ? (
            <section className="student-error-panel">{errorMessage}</section>
          ) : null}

          <section className="student-hero-grid">
            <DashboardMiniListCard
              label={copy.heroNewsTitle}
              title={copy.heroNewsTitle}
              emptyState={copy.emptyState}
              items={dashboardState.news.slice(0, 2).map((item) => ({
                key: item.id,
                primary: item.title,
                secondary: item.is_published ? copy.newsPublished : copy.newsDraft,
              }))}
            />

            <DashboardMiniListCard
              label={copy.heroGradesTitle}
              title={copy.heroGradesTitle}
              emptyState={copy.emptyState}
              items={latestGrades.map((item) => ({
                key: item.id,
                primary: `${item.student_login} · ${item.subject_name ?? "-"}`,
                secondary: item.mark_value ?? "-",
              }))}
            />

            <DashboardMetricCard
              label={copy.heroSchedulesTitle}
              title={copy.heroSchedulesTitle}
              value={todayScheduleCount}
            />

            <DashboardMetricCard
              label={copy.heroRatingTitle}
              title={copy.heroRatingTitle}
              value={topLeaderboard[0]?.rating ?? "-"}
            />
          </section>

          <section className="student-content-grid">
            <div className="student-content-main">
              <ProfileCard
                id="admin-profile"
                sectionLabel={copy.topProfile}
                title={copy.profileTitle}
                description={copy.profileDescription}
                loginLabel={copy.profileLogin}
                emailLabel={copy.profileEmail}
                roleLabel={copy.profileRole}
                passwordLabel={copy.profilePassword}
                showHashLabel={copy.profileShowHash}
                hideHashLabel={copy.profileHideHash}
                login={dashboardState.profile?.login ?? userSession?.login ?? "-"}
                email={dashboardState.profile?.email ?? userSession?.email ?? "-"}
                role={dashboardState.profile?.role ?? userSession?.role ?? "-"}
                passwordHash={dashboardState.profile?.passwordHash ?? null}
                isHashVisible={isHashVisible}
                onToggleHash={() => setIsHashVisible((current) => !current)}
              />

              <section className="student-card" id="news-editor">
                <div className="student-section-heading">
                  <div>
                    <p className="student-card-label">{copy.topNews}</p>
                    <h2>{copy.newsEditorTitle}</h2>
                  </div>
                  <p>{copy.newsEditorDescription}</p>
                </div>

                <form className="admin-news-form" onSubmit={handleNewsSubmit}>
                  <label className="admin-news-field">
                    <span>{copy.newsTitleLabel}</span>
                    <input
                      value={newsTitle}
                      onChange={(event) => setNewsTitle(event.target.value)}
                      type="text"
                    />
                  </label>
                  <label className="admin-news-field">
                    <span>{copy.newsContentLabel}</span>
                    <textarea
                      value={newsContent}
                      onChange={(event) => setNewsContent(event.target.value)}
                      rows={6}
                    />
                  </label>
                  <label className="admin-news-toggle">
                    <input
                      checked={isPublished}
                      onChange={(event) => setIsPublished(event.target.checked)}
                      type="checkbox"
                    />
                    <span>{copy.newsPublishedLabel}</span>
                  </label>

                  {message ? (
                    <p className="auth-message auth-message-success">{message}</p>
                  ) : null}

                  <button className="auth-submit" type="submit" disabled={isSavingNews}>
                    {editingNewsId ? copy.newsUpdate : copy.newsCreate}
                  </button>
                </form>
              </section>

              <DashboardTableCard
                id="all-grades"
                label={copy.topGrades}
                title={copy.allGradesTitle}
                description={copy.allGradesDescription}
                headers={[
                  copy.gradesStudent,
                  copy.gradesClass,
                  copy.gradesSubject,
                  copy.gradesLesson,
                  copy.gradesMark,
                  copy.gradesDate,
                ]}
                emptyState={copy.emptyState}
                emptyColSpan={6}
                hasData={dashboardState.grades.length > 0}
              >
                {dashboardState.grades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.student_login}</td>
                    <td>{grade.class_name ?? "-"}</td>
                    <td>{grade.subject_name ?? "-"}</td>
                    <td>{grade.lesson_name ?? "-"}</td>
                    <td>{grade.mark_value ?? "-"}</td>
                    <td>{formatDateLabel(grade.mark_date)}</td>
                  </tr>
                ))}
              </DashboardTableCard>
            </div>

            <aside className="student-content-side">
              <DashboardTableCard
                id="student-schedules"
                label={copy.topSchedules}
                title={copy.studentSchedulesTitle}
                headers={[
                  copy.scheduleStudent,
                  copy.scheduleTime,
                  copy.scheduleSubject,
                  copy.scheduleTeacher,
                ]}
                emptyState={copy.emptyState}
                emptyColSpan={4}
                hasData={dashboardState.studentSchedules.length > 0}
                compact
              >
                {dashboardState.studentSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>{item.student_login}</td>
                    <td>{formatTimeRange(item.start_time, item.end_time)}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.teacher_name}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="teacher-schedules"
                label={copy.topSchedules}
                title={copy.teacherSchedulesTitle}
                headers={[
                  copy.scheduleTeacher,
                  copy.scheduleTime,
                  copy.scheduleSubject,
                  copy.scheduleClass,
                ]}
                emptyState={copy.emptyState}
                emptyColSpan={4}
                hasData={dashboardState.teacherSchedules.length > 0}
                compact
              >
                {dashboardState.teacherSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>{item.teacher_name}</td>
                    <td>{formatTimeRange(item.start_time, item.end_time)}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.class_name}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="class-schedules"
                label={copy.topSchedules}
                title={copy.classSchedulesTitle}
                headers={[
                  copy.scheduleClass,
                  copy.scheduleTime,
                  copy.scheduleSubject,
                  copy.scheduleTeacher,
                ]}
                emptyState={copy.emptyState}
                emptyColSpan={4}
                hasData={dashboardState.classSchedules.length > 0}
                compact
              >
                {dashboardState.classSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>{item.class_name}</td>
                    <td>{formatTimeRange(item.start_time, item.end_time)}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.teacher_name}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="school-rating"
                label={copy.topRating}
                title={copy.ratingTitle}
                description={copy.ratingDescription}
                headers={[copy.ratingPlace, copy.ratingStudent, copy.ratingScore]}
                emptyState={copy.emptyState}
                emptyColSpan={3}
                hasData={topLeaderboard.length > 0}
                compact
              >
                {topLeaderboard.map((item, index) => (
                  <tr key={item.login}>
                    <td>{index + 1}</td>
                    <td>{item.maskedLogin}</td>
                    <td>{item.rating}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="news-list"
                label={copy.topNews}
                title={copy.heroNewsTitle}
                headers={[copy.newsTitleLabel, copy.newsPublishedLabel, copy.gradesDate]}
                emptyState={copy.emptyState}
                emptyColSpan={3}
                hasData={dashboardState.news.length > 0}
                compact
              >
                {dashboardState.news.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-news-cell">
                        <strong>{item.title}</strong>
                        <button
                          className="student-inline-button"
                          type="button"
                          onClick={() => handleEditNews(item)}
                        >
                          {copy.newsEdit}
                        </button>
                      </div>
                    </td>
                    <td>{item.is_published ? copy.newsPublished : copy.newsDraft}</td>
                    <td>{formatDateTimeLabel(item.updated_at)}</td>
                  </tr>
                ))}
              </DashboardTableCard>
            </aside>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
