import { calculateStudentRating, maskStudentLogin } from "@/functions/rating";
import { supabase } from "@/functions/supabase";

export type StudentProfile = {
  login: string;
  email: string;
  role: string;
  passwordHash: string;
};

export type StudentGrade = {
  id: string;
  subject_name: string | null;
  lesson_name: string | null;
  mark_value: string | null;
  mark_numeric: number | null;
  mark_date: string | null;
};

export type StudentScheduleEntry = {
  id: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  teacher_name: string;
  classroom: string | null;
};

export type TeacherScheduleEntry = {
  id: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  teacher_name: string;
  subject_name: string;
  class_name: string;
  classroom: string | null;
};

export type ClassScheduleEntry = {
  id: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  classroom: string | null;
};

export type StudentLeaderboardEntry = {
  login: string;
  maskedLogin: string;
  rating: number;
};

export async function getStudentProfile(login: string) {
  const { data, error } = await supabase.rpc("get_student_profile", {
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
  } satisfies StudentProfile;
}

export async function getStudentGrades(login: string) {
  const { data, error } = await supabase
    .from("student_grades")
    .select("id, subject_name, lesson_name, mark_value, mark_numeric, mark_date")
    .eq("student_login", login)
    .order("mark_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentGrade[];
}

export async function getStudentTodaySchedule(login: string, lessonDate: string) {
  const { data, error } = await supabase
    .from("student_schedules")
    .select(
      "id, lesson_date, start_time, end_time, subject_name, teacher_name, classroom",
    )
    .eq("student_login", login)
    .eq("lesson_date", lessonDate)
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentScheduleEntry[];
}

export async function getTeacherSchedules(lessonDate: string) {
  const { data, error } = await supabase
    .from("teacher_schedules")
    .select(
      "id, lesson_date, start_time, end_time, teacher_name, subject_name, class_name, classroom",
    )
    .eq("lesson_date", lessonDate)
    .order("teacher_name", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TeacherScheduleEntry[];
}

export async function getClassSchedules(lessonDate: string) {
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

  return (data ?? []) as ClassScheduleEntry[];
}

export async function getStudentLeaderboard() {
  const { data, error } = await supabase
    .from("student_grades")
    .select("student_login, mark_value, mark_numeric, mark_date")
    .order("student_login", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const groupedGrades = new Map<
    string,
    Array<{ mark_value: string | null; mark_numeric: number | null; mark_date: string | null }>
  >();

  for (const grade of data ?? []) {
    const currentGrades = groupedGrades.get(grade.student_login) ?? [];
    currentGrades.push({
      mark_value: grade.mark_value,
      mark_numeric: grade.mark_numeric,
      mark_date: grade.mark_date,
    });
    groupedGrades.set(grade.student_login, currentGrades);
  }

  return Array.from(groupedGrades.entries())
    .map(([login, grades]) => ({
      login,
      maskedLogin: maskStudentLogin(login),
      rating: calculateStudentRating(grades),
    }))
    .sort((left, right) => right.rating - left.rating);
}
