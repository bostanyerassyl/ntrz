import {
  getStudentLeaderboard,
  getStudentProfile,
  type StudentLeaderboardEntry,
} from "@/functions/student-portal";
import { supabase } from "@/functions/supabase";

export type AdminProfile = {
  login: string;
  email: string;
  role: string;
  passwordHash: string;
};

export type AdminGradeEntry = {
  id: string;
  student_login: string;
  student_email: string | null;
  class_name: string | null;
  subject_name: string | null;
  lesson_name: string | null;
  mark_value: string | null;
  mark_numeric: number | null;
  mark_date: string | null;
};

export type AdminStudentScheduleEntry = {
  id: string;
  student_login: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  teacher_name: string;
  classroom: string | null;
};

export type AdminTeacherScheduleEntry = {
  id: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  teacher_login: string | null;
  teacher_name: string;
  subject_name: string;
  class_name: string;
  classroom: string | null;
};

export type AdminClassScheduleEntry = {
  id: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  classroom: string | null;
};

export type SchoolNewsEntry = {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_by_login: string | null;
  created_at: string;
  updated_at: string;
};

export type SchoolNewsInput = {
  title: string;
  content: string;
  isPublished: boolean;
  adminLogin: string;
};

export async function getAdminProfile(login: string) {
  const { data, error } = await supabase.rpc("get_admin_profile", {
    input_login: login,
  });

  if (error) {
    const isMissingFunction =
      error.message.includes("schema cache") || error.message.includes("get_admin_profile");

    if (!isMissingFunction) {
      throw new Error(error.message);
    }

    const fallbackProfile = await getStudentProfile(login);

    if (!fallbackProfile || fallbackProfile.role !== "admin") {
      return null;
    }

    return {
      login: fallbackProfile.login,
      email: fallbackProfile.email,
      role: fallbackProfile.role,
      passwordHash: fallbackProfile.passwordHash,
    } satisfies AdminProfile;
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
  } satisfies AdminProfile;
}

export async function getAllGrades() {
  const { data, error } = await supabase
    .from("student_grades")
    .select(
      "id, student_login, student_email, class_name, subject_name, lesson_name, mark_value, mark_numeric, mark_date",
    )
    .order("mark_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminGradeEntry[];
}

export async function getAllStudentSchedules(lessonDate: string) {
  const { data, error } = await supabase
    .from("student_schedules")
    .select(
      "id, student_login, lesson_date, start_time, end_time, subject_name, teacher_name, classroom",
    )
    .eq("lesson_date", lessonDate)
    .order("student_login", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminStudentScheduleEntry[];
}

export async function getAllTeacherSchedules(lessonDate: string) {
  const { data, error } = await supabase
    .from("teacher_schedules")
    .select(
      "id, lesson_date, start_time, end_time, teacher_login, teacher_name, subject_name, class_name, classroom",
    )
    .eq("lesson_date", lessonDate)
    .order("teacher_name", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminTeacherScheduleEntry[];
}

export async function getAllClassSchedules(lessonDate: string) {
  const { data, error } = await supabase
    .from("class_schedules")
    .select(
      "id, lesson_date, start_time, end_time, class_name, subject_name, teacher_name, classroom",
    )
    .eq("lesson_date", lessonDate)
    .order("class_name", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminClassScheduleEntry[];
}

export async function getSchoolNews() {
  const { data, error } = await supabase
    .from("school_news")
    .select("id, title, content, is_published, created_by_login, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    const isMissingTable =
      error.message.includes("school_news") || error.message.includes("schema cache");

    if (isMissingTable) {
      return [];
    }

    throw new Error(error.message);
  }

  return (data ?? []) as SchoolNewsEntry[];
}

export async function createSchoolNews(input: SchoolNewsInput) {
  const { data, error } = await supabase
    .from("school_news")
    .insert({
      title: input.title.trim(),
      content: input.content.trim(),
      is_published: input.isPublished,
      created_by_login: input.adminLogin,
    })
    .select("id, title, content, is_published, created_by_login, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SchoolNewsEntry;
}

export async function updateSchoolNews(
  newsId: string,
  input: Pick<SchoolNewsInput, "title" | "content" | "isPublished">,
) {
  const { data, error } = await supabase
    .from("school_news")
    .update({
      title: input.title.trim(),
      content: input.content.trim(),
      is_published: input.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", newsId)
    .select("id, title, content, is_published, created_by_login, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SchoolNewsEntry;
}

export async function getAdminDashboardData(lessonDate: string, login: string) {
  const [profile, grades, studentSchedules, teacherSchedules, classSchedules, leaderboard, news] =
    await Promise.all([
      getAdminProfile(login),
      getAllGrades(),
      getAllStudentSchedules(lessonDate),
      getAllTeacherSchedules(lessonDate),
      getAllClassSchedules(lessonDate),
      getStudentLeaderboard(),
      getSchoolNews(),
    ]);

  return {
    profile,
    grades,
    studentSchedules,
    teacherSchedules,
    classSchedules,
    leaderboard,
    news,
  } satisfies {
    profile: AdminProfile | null;
    grades: AdminGradeEntry[];
    studentSchedules: AdminStudentScheduleEntry[];
    teacherSchedules: AdminTeacherScheduleEntry[];
    classSchedules: AdminClassScheduleEntry[];
    leaderboard: StudentLeaderboardEntry[];
    news: SchoolNewsEntry[];
  };
}
