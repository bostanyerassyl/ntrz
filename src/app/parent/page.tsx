"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardMiniListCard } from "@/components/dashboard/dashboard-mini-list-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardTableCard } from "@/components/dashboard/dashboard-table-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import {
  getParentPortalCopy,
  getStoredLanguage,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import { getParentDashboardData, type ParentDashboardData } from "@/functions/parent-portal";
import { getRoleHomeRoute } from "@/functions/permissions";
import {
  clearStoredUserSession,
  getStoredUserSession,
  type StoredUserSession,
} from "@/functions/user-session";

const initialDashboardState: ParentDashboardData = {
  profile: null,
  childLink: null,
  childProfile: null,
  childGrades: [],
  childSchedule: [],
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

export default function ParentPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [userSession, setUserSession] = useState<StoredUserSession | null>(null);
  const [dashboardState, setDashboardState] =
    useState<ParentDashboardData>(initialDashboardState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<"me" | "child" | null>(null);
  const [isHashVisible, setIsHashVisible] = useState(false);

  const copy = getParentPortalCopy(language);
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

    if (storedSession.role !== "parent") {
      if (storedSession.role === "student" || storedSession.role === "teacher") {
        router.push(getRoleHomeRoute(storedSession.role));
        return;
      }

      router.push("/login");
      return;
    }

    const session = storedSession;

    async function loadParentDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const parentData = await getParentDashboardData(session.login, lessonDate);
        setDashboardState(parentData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load parent dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadParentDashboard();
  }, [lessonDate, router]);

  function handleLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
  }

  function handleLogout() {
    clearStoredUserSession();
    router.push("/login");
  }

  const topLeaderboard = dashboardState.leaderboard.slice(0, 8);
  const childRating =
    topLeaderboard.find((item) => item.login === dashboardState.childLink?.student_login)?.rating ??
    "-";
  const latestGrades = dashboardState.childGrades.slice(0, 4);
  const menuGroups = [
    {
      key: "me",
      label: copy.topMe,
      items: [{ href: "#parent-profile", label: copy.topProfile }],
    },
    {
      key: "child",
      label: copy.topChild,
      items: [
        { href: "#child-overview", label: copy.topProfile },
        { href: "#child-grades", label: copy.topGrades },
        { href: "#child-schedule", label: copy.topTimetable },
        { href: "#child-rating", label: copy.topRating },
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
        setActiveMenu((current) => (current === menuKey ? null : (menuKey as "me" | "child")))
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
              label={copy.heroChildTitle}
              title={copy.heroChildTitle}
              emptyState={copy.emptyState}
              items={
                dashboardState.childProfile
                  ? [
                      {
                        key: dashboardState.childProfile.login,
                        primary: dashboardState.childProfile.login,
                        secondary: dashboardState.childProfile.email,
                      },
                    ]
                  : []
              }
            />

            <DashboardMiniListCard
              label={copy.heroScheduleTitle}
              title={copy.heroScheduleTitle}
              emptyState={copy.emptyState}
              items={dashboardState.childSchedule.slice(0, 4).map((item) => ({
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
              value={childRating}
            />
          </section>

          <section className="student-content-grid">
            <div className="student-content-main">
              <ProfileCard
                id="parent-profile"
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
                id="child-grades"
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
                hasData={dashboardState.childGrades.length > 0}
              >
                {dashboardState.childGrades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.subject_name ?? "-"}</td>
                    <td>{grade.lesson_name ?? "-"}</td>
                    <td>{grade.mark_value ?? "-"}</td>
                    <td>{formatDateLabel(grade.mark_date)}</td>
                  </tr>
                ))}
              </DashboardTableCard>

              <DashboardTableCard
                id="child-schedule"
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
                hasData={dashboardState.childSchedule.length > 0}
              >
                {dashboardState.childSchedule.map((item) => (
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
                id="child-overview"
                label={copy.topChild}
                title={copy.childTitle}
                description={copy.childDescription}
                headers={[copy.childLogin, copy.childEmail]}
                emptyState={copy.emptyState}
                emptyColSpan={2}
                hasData={Boolean(dashboardState.childProfile)}
                compact
              >
                {dashboardState.childProfile ? (
                  <tr>
                    <td>{dashboardState.childProfile.login}</td>
                    <td>{dashboardState.childProfile.email}</td>
                  </tr>
                ) : null}
              </DashboardTableCard>

              <DashboardTableCard
                id="child-rating"
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
