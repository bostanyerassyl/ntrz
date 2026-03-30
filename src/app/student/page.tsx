"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardMiniListCard } from "@/components/dashboard/dashboard-mini-list-card";
import { NewsHeroCard } from "@/components/dashboard/news-hero-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { DashboardTableCard } from "@/components/dashboard/dashboard-table-card";
import {
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

    const session = storedSession;

    async function loadStudentDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [profile, grades, todaySchedule, teacherSchedules, classSchedules, leaderboard] =
          await Promise.all([
            getStudentProfile(session.login),
            getStudentGrades(session.login),
            getStudentTodaySchedule(session.login, lessonDate),
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
  const latestRating =
    topLeaderboard.find((item) => item.login === userSession?.login)?.rating ?? "-";
  const menuGroups = [
    {
      key: "me",
      label: copy.topMe,
      items: [
        { href: "#student-profile", label: copy.topProfile },
        { href: "#student-grades", label: copy.topGrades },
        { href: "#student-schedule", label: copy.topTimetable },
      ],
    },
    {
      key: "school",
      label: copy.topSchool,
      items: [
        { href: "#school-news", label: copy.topSchoolNews },
        { href: "#teacher-schedules", label: copy.topTeacherSchedules },
        { href: "#class-schedules", label: copy.topClassSchedules },
        { href: "#student-rating", label: copy.topRating },
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
      logoutLabel="Logout"
      activeMenu={activeMenu}
      onToggleMenu={(menuKey) =>
        setActiveMenu((current) => (current === menuKey ? null : (menuKey as "me" | "school")))
      }
      menuGroups={menuGroups}
      footerRegistrationLabel="Registration"
      footerLoginLabel="Login"
    >
      {isLoading ? (
        <section className="student-loading-panel">{copy.loading}</section>
      ) : (
        <>
          {errorMessage ? (
            <section className="student-error-panel">{errorMessage}</section>
          ) : null}

          <section className="student-hero-grid">
            <NewsHeroCard
              id="school-news"
              label={copy.heroNewsTitle}
              title={copy.heroNewsTitle}
              description={copy.heroNewsDescription}
              secondaryTitle={copy.topSchool}
              emptyState={copy.emptyState}
            />
            <DashboardMiniListCard
              label={copy.heroScheduleTitle}
              title={copy.heroScheduleTitle}
              emptyState={copy.emptyState}
              items={dashboardState.todaySchedule.slice(0, 4).map((item) => ({
                key: item.id,
                primary: item.subject_name,
                secondary: formatTimeRange(item.start_time, item.end_time),
              }))}
            />

            <DashboardMiniListCard
              label={copy.heroGradesTitle}
              title={copy.heroGradesTitle}
              emptyState={copy.emptyState}
              items={latestGrades.map((item) => ({
                key: item.id,
                primary: item.subject_name ?? copy.emptyState,
                secondary: item.mark_value ?? "-",
              }))}
            />

            <DashboardMetricCard
              label={copy.heroRatingTitle}
              title={copy.heroRatingTitle}
              value={latestRating}
            />
          </section>

          <section className="student-content-grid">
            <div className="student-content-main">
              <ProfileCard
                id="student-profile"
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

              <DashboardTableCard
                id="student-grades"
                label={copy.topGrades}
                title={copy.gradesTitle}
                description={copy.gradesDescription}
                headers={[
                  copy.gradesSubject,
                  copy.gradesLesson,
                  copy.gradesMark,
                  copy.gradesDate,
                ]}
                emptyState={copy.emptyState}
                emptyColSpan={4}
                hasData={dashboardState.grades.length > 0}
              >
                {dashboardState.grades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.subject_name ?? "-"}</td>
                    <td>{grade.lesson_name ?? "-"}</td>
                    <td>{grade.mark_value ?? "-"}</td>
                    <td>{formatDateLabel(grade.mark_date)}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="student-schedule"
                label={copy.topTimetable}
                title={copy.timetableTitle}
                description={copy.timetableDescription}
                headers={[
                  copy.timetableTime,
                  copy.gradesSubject,
                  copy.timetableTeacher,
                  copy.timetableClassroom,
                ]}
                emptyState={copy.emptyState}
                emptyColSpan={4}
                hasData={dashboardState.todaySchedule.length > 0}
              >
                {dashboardState.todaySchedule.map((item) => (
                  <tr key={item.id}>
                    <td>{formatTimeRange(item.start_time, item.end_time)}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.teacher_name}</td>
                    <td>{item.classroom ?? "-"}</td>
                  </tr>
                ))}
              </DashboardTableCard>
            </div>

            <aside className="student-content-side">
              <DashboardTableCard
                id="teacher-schedules"
                label={copy.topTeacherSchedules}
                title={copy.teacherSchedulesTitle}
                headers={[copy.scheduleTeacher, copy.scheduleSubject, copy.scheduleClass]}
                emptyState={copy.emptyState}
                emptyColSpan={3}
                hasData={dashboardState.teacherSchedules.length > 0}
                compact
              >
                {dashboardState.teacherSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>{item.teacher_name}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.class_name}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="class-schedules"
                label={copy.topClassSchedules}
                title={copy.classSchedulesTitle}
                headers={[copy.scheduleClass, copy.scheduleSubject, copy.scheduleTeacher]}
                emptyState={copy.emptyState}
                emptyColSpan={3}
                hasData={dashboardState.classSchedules.length > 0}
                compact
              >
                {dashboardState.classSchedules.map((item) => (
                  <tr key={item.id}>
                    <td>{item.class_name}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.teacher_name}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="student-rating"
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
            </aside>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
