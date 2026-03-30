import { HighlightMetric, PortalRole } from "@/entities/portal/model/types";

export const portalRoles: PortalRole[] = [
  {
    id: "student",
    title: "Student dashboard",
    summary:
      "Track grades, set study goals, and stay visible in a motivation-based ranking tied to progress and consistency.",
    accent: "#0f766e",
    metrics: [
      { label: "Current GPA", value: "4.6 / 5" },
      { label: "Quarter goals", value: "3 active" },
      { label: "Leaderboard", value: "#7" },
    ],
  },
  {
    id: "teacher",
    title: "Teacher overview",
    summary:
      "Spot learners at risk fast, review subject trends, and focus attention where average scores and dynamics are slipping.",
    accent: "#b45309",
    metrics: [
      { label: "Risk students", value: "12" },
      { label: "Class average", value: "78%" },
      { label: "Subjects tracked", value: "6" },
    ],
  },
  {
    id: "parent",
    title: "Parent insights",
    summary:
      "Understand a child's academic trajectory through grade dynamics, problem alerts, and weekly feedback summaries.",
    accent: "#c2415d",
    metrics: [
      { label: "Progress trend", value: "+8%" },
      { label: "Pending issues", value: "2" },
      { label: "Attendance", value: "96%" },
    ],
  },
  {
    id: "admin",
    title: "Administration hub",
    summary:
      "Publish school news, observe overall academic performance, and monitor school-wide movement across grades and classes.",
    accent: "#4338ca",
    metrics: [
      { label: "School average", value: "81%" },
      { label: "Open announcements", value: "5" },
      { label: "Classes monitored", value: "24" },
    ],
  },
];

export const portalHighlights: HighlightMetric[] = [
  {
    label: "Unified roles",
    value: "4 dashboards",
    note: "One visual system for students, teachers, parents, and admins.",
  },
  {
    label: "Risk monitoring",
    value: "< 3.0 GPA",
    note: "Initial rule for teacher alerts can later expand into trend-based detection.",
  },
  {
    label: "Data source plan",
    value: "BilimClass",
    note: "Frontend and mock logic are ready to swap to live academic data later.",
  },
];
