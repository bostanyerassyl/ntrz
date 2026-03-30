import {
  getStudentGrades,
  getStudentLeaderboard,
  getStudentProfile,
  getStudentTodaySchedule,
  type StudentGrade,
  type StudentLeaderboardEntry,
  type StudentProfile,
  type StudentScheduleEntry,
} from "@/functions/student-portal";
import { supabase } from "@/functions/supabase";

export type ParentProfile = {
  login: string;
  email: string;
  role: string;
  passwordHash: string;
};

export type ParentChildLink = {
  id: string;
  parent_login: string;
  student_login: string;
};

export async function getParentProfile(login: string) {
  const { data, error } = await supabase.rpc("get_parent_profile", {
    input_login: login,
  });

  if (error) {
    throw new Error(error.message);
  }

  const profile = Array.isArray(data) ? data[0] : data;

  if (!profile) {
    return null;
  }

  return {
    login: profile.login,
    email: profile.email,
    role: profile.role,
    passwordHash: profile.password_hash,
  } satisfies ParentProfile;
}

export async function getParentChildLinks(parentLogin: string) {
  const { data, error } = await supabase
    .from("parent_student_links")
    .select("id, parent_login, student_login")
    .eq("parent_login", parentLogin)
    .order("student_login", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ParentChildLink[];
}

export type ParentDashboardData = {
  profile: ParentProfile | null;
  childLink: ParentChildLink | null;
  childProfile: StudentProfile | null;
  childGrades: StudentGrade[];
  childSchedule: StudentScheduleEntry[];
  leaderboard: StudentLeaderboardEntry[];
};

export async function getParentDashboardData(parentLogin: string, lessonDate: string) {
  const [profile, childLinks, leaderboard] = await Promise.all([
    getParentProfile(parentLogin),
    getParentChildLinks(parentLogin),
    getStudentLeaderboard(),
  ]);

  const childLink = childLinks[0] ?? null;

  if (!childLink) {
    return {
      profile,
      childLink: null,
      childProfile: null,
      childGrades: [],
      childSchedule: [],
      leaderboard,
    } satisfies ParentDashboardData;
  }

  const [childProfile, childGrades, childSchedule] = await Promise.all([
    getStudentProfile(childLink.student_login),
    getStudentGrades(childLink.student_login),
    getStudentTodaySchedule(childLink.student_login, lessonDate),
  ]);

  return {
    profile,
    childLink,
    childProfile,
    childGrades,
    childSchedule,
    leaderboard,
  } satisfies ParentDashboardData;
}
