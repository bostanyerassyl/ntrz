"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NewsHeroCard } from "@/components/dashboard/news-hero-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import {
  getStoredLanguage,
  getTeacherPortalCopy,
  type LanguageCode,
  setStoredLanguage,
} from "@/functions/language";
import { getRoleHomeRoute } from "@/functions/permissions";
import { getStudentLeaderboard, type StudentLeaderboardEntry } from "@/functions/student-portal";
import {
  getTeacherDashboardData,
  type TeacherAssignment,
  type TeacherOwnScheduleEntry,
  type TeacherProfile,
  type TeacherVisibleGrade,
} from "@/functions/teacher-portal";
import {
  clearStoredUserSession,
  getStoredUserSession,
  type StoredUserSession,
} from "@/functions/user-session";
import { type ClassScheduleEntry, type TeacherScheduleEntry } from "@/functions/student-portal";
import { type CriticalZoneEntry } from "@/functions/critical-zone";

type TeacherDashboardState = {
  profile: TeacherProfile | null;
  assignments: TeacherAssignment[];
  ownSchedule: TeacherOwnScheduleEntry[];
  visibleGrades: TeacherVisibleGrade[];
  schoolTeacherSchedules: TeacherScheduleEntry[];
  classSchedules: ClassScheduleEntry[];
  criticalZone: CriticalZoneEntry[];
  leaderboard: StudentLeaderboardEntry[];
};

const initialDashboardState: TeacherDashboardState = {
  profile: null,
  assignments: [],
  ownSchedule: [],
  visibleGrades: [],
  schoolTeacherSchedules: [],
  classSchedules: [],
  criticalZone: [],
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

export default function TeacherPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [userSession, setUserSession] = useState<StoredUserSession | null>(null);
  const [dashboardState, setDashboardState] =
    useState<TeacherDashboardState>(initialDashboardState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<"me" | "school" | null>(null);
  const [isHashVisible, setIsHashVisible] = useState(false);

  const copy = getTeacherPortalCopy(language);
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

    if (storedSession.role !== "teacher") {
      if (storedSession.role === "student") {
        router.push(getRoleHomeRoute(storedSession.role));
        return;
      }

      router.push("/login");
      return;
    }

    async function loadTeacherDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [teacherData, leaderboard] = await Promise.all([
          getTeacherDashboardData(storedSession.login, lessonDate),
          getStudentLeaderboard(),
        ]);

        setDashboardState({
          ...teacherData,
          leaderboard,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load teacher dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadTeacherDashboard();
  }, [lessonDate, router]);

  function handleLanguageChange(nextLanguage: LanguageCode) {
    setLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
  }

  function handleLogout() {
    clearStoredUserSession();
    router.push("/login");
  }

  const latestVisibleGrades = dashboardState.visibleGrades.slice(0, 4);
  const topLeaderboard = dashboardState.leaderboard.slice(0, 8);
  const menuGroups = [
    {
      key: "me",
      label: copy.topMe,
      items: [
        { href: "#teacher-profile", label: copy.topProfile },
        { href: "#teacher-grades", label: copy.topGrades },
        { href: "#teacher-schedule", label: copy.topTimetable },
        { href: "#teacher-assignments", label: copy.topAssignments },
      ],
    },
    {
      key: "school",
      label: copy.topSchool,
      items: [
        { href: "#school-news", label: copy.topSchoolNews },
        { href: "#critical-zone", label: copy.topCriticalZone },
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
            <NewsHeroCard
              id="school-news"
              label={copy.heroNewsTitle}
              title={copy.heroNewsTitle}
              description={copy.heroNewsDescription}
              secondaryTitle={copy.topSchool}
              emptyState={copy.emptyState}
            />

              <article className="student-card">
                <p className="student-card-label">{copy.heroScheduleTitle}</p>
                <h2>{copy.heroScheduleTitle}</h2>
                <div className="student-mini-list">
                  {dashboardState.ownSchedule.length ? (
                    dashboardState.ownSchedule.slice(0, 4).map((item) => (
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
                  {latestVisibleGrades.length ? (
                    latestVisibleGrades.map((item) => (
                      <div key={item.id} className="student-mini-list-item">
                        <strong>{item.student_login}</strong>
                        <span>{item.mark_value ?? "-"}</span>
                      </div>
                    ))
                  ) : (
                    <div className="student-empty-line">{copy.emptyState}</div>
                  )}
                </div>
              </article>

              <article className="student-card student-card-rating">
                <p className="student-card-label">{copy.heroCriticalTitle}</p>
                <h2>{copy.heroCriticalTitle}</h2>
                <p className="student-rating-value">
                  {dashboardState.criticalZone.length || "-"}
                </p>
              </article>
            </section>

            <section className="student-content-grid">
              <div className="student-content-main">
                <ProfileCard
                  id="teacher-profile"
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

                <DashboardSectionCard
                  id="teacher-grades"
                  label={copy.topGrades}
                  title={copy.gradesTitle}
                  description={copy.gradesDescription}
                >
                  <div className="student-table-wrap">
                    <table className="student-table">
                      <thead>
                        <tr>
                          <th>{copy.gradesStudent}</th>
                          <th>{copy.gradesClass}</th>
                          <th>{copy.gradesSubject}</th>
                          <th>{copy.gradesLesson}</th>
                          <th>{copy.gradesMark}</th>
                          <th>{copy.gradesDate}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.visibleGrades.length ? (
                          dashboardState.visibleGrades.map((grade) => (
                            <tr key={grade.id}>
                              <td>{grade.student_login}</td>
                              <td>{grade.class_name ?? "-"}</td>
                              <td>{grade.subject_name ?? "-"}</td>
                              <td>{grade.lesson_name ?? "-"}</td>
                              <td>{grade.mark_value ?? "-"}</td>
                              <td>{formatDateLabel(grade.mark_date)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </DashboardSectionCard>

                <DashboardSectionCard
                  id="teacher-schedule"
                  label={copy.topTimetable}
                  title={copy.timetableTitle}
                  description={copy.timetableDescription}
                >
                  <div className="student-table-wrap">
                    <table className="student-table">
                      <thead>
                        <tr>
                          <th>{copy.timetableTime}</th>
                          <th>{copy.gradesSubject}</th>
                          <th>{copy.gradesClass}</th>
                          <th>{copy.timetableClassroom}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.ownSchedule.length ? (
                          dashboardState.ownSchedule.map((item) => (
                            <tr key={item.id}>
                              <td>{formatTimeRange(item.start_time, item.end_time)}</td>
                              <td>{item.subject_name}</td>
                              <td>{item.class_name}</td>
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
                </DashboardSectionCard>

                <DashboardSectionCard
                  id="critical-zone"
                  label={copy.topCriticalZone}
                  title={copy.criticalTitle}
                  description={copy.criticalDescription}
                >
                  <div className="student-table-wrap">
                    <table className="student-table">
                      <thead>
                        <tr>
                          <th>{copy.criticalStudent}</th>
                          <th>{copy.gradesClass}</th>
                          <th>{copy.gradesSubject}</th>
                          <th>{copy.criticalAverage}</th>
                          <th>{copy.criticalCount}</th>
                          <th>{copy.criticalLatest}</th>
                          <th>{copy.criticalStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.criticalZone.length ? (
                          dashboardState.criticalZone.map((item) => (
                            <tr key={`${item.studentLogin}-${item.subjectName ?? "subject"}`}>
                              <td>{item.studentLogin}</td>
                              <td>{item.className ?? "-"}</td>
                              <td>{item.subjectName ?? "-"}</td>
                              <td>{item.averageScore}</td>
                              <td>{item.gradesCount}</td>
                              <td>
                                {item.latestMark ? `${item.latestMark} / ` : ""}
                                {formatDateLabel(item.latestDate)}
                              </td>
                              <td>
                                <span
                                  className={`student-status-pill${
                                    item.riskLevel === "critical" ? " is-critical" : " is-warning"
                                  }`}
                                >
                                  {item.riskLevel === "critical"
                                    ? copy.criticalCritical
                                    : copy.criticalWarning}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="student-empty-row">
                              {copy.emptyState}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </DashboardSectionCard>
              </div>

              <aside className="student-content-side">
                <DashboardSectionCard
                  id="teacher-assignments"
                  label={copy.topAssignments}
                  title={copy.assignmentsTitle}
                  description={copy.assignmentsDescription}
                >
                  <div className="student-table-wrap">
                    <table className="student-table student-table-compact">
                      <thead>
                        <tr>
                          <th>{copy.assignmentTeacher}</th>
                          <th>{copy.assignmentSubject}</th>
                          <th>{copy.assignmentClass}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardState.assignments.length ? (
                          dashboardState.assignments.map((item) => (
                            <tr key={item.id}>
                              <td>{item.teacher_name}</td>
                              <td>{item.subject_name}</td>
                              <td>{item.class_name ?? "-"}</td>
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
                </DashboardSectionCard>

                <DashboardSectionCard
                  id="teacher-schedules"
                  label={copy.topTeacherSchedules}
                  title={copy.teacherSchedulesTitle}
                >
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
                        {dashboardState.schoolTeacherSchedules.length ? (
                          dashboardState.schoolTeacherSchedules.map((item) => (
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
                </DashboardSectionCard>

                <DashboardSectionCard
                  id="class-schedules"
                  label={copy.topClassSchedules}
                  title={copy.classSchedulesTitle}
                >
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
                </DashboardSectionCard>

                <DashboardSectionCard
                  id="student-rating"
                  label={copy.topRating}
                  title={copy.ratingTitle}
                  description={copy.ratingDescription}
                >
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
                </DashboardSectionCard>
              </aside>
            </section>
          </>
        )}
    </DashboardShell>
  );
}
