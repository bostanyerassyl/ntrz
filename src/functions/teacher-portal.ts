import { getCriticalZoneStudents } from "@/functions/critical-zone";
import { getClassSchedules, getTeacherSchedules } from "@/functions/student-portal";
import { supabase } from "@/functions/supabase";

export type TeacherProfile = {
  login: string;
  email: string;
  role: string;
  passwordHash: string;
};

export type TeacherAssignment = {
  id: string;
  teacher_login: string;
  teacher_name: string;
  subject_name: string;
  class_name: string | null;
};

export type TeacherOwnScheduleEntry = {
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

export type TeacherVisibleGrade = {
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

export async function getTeacherProfile(login: string) {
  const { data, error } = await supabase.rpc("get_teacher_profile", {
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
  } satisfies TeacherProfile;
}

export async function getTeacherAssignments(login: string) {
  const { data, error } = await supabase
    .from("teacher_subject_assignments")
    .select("id, teacher_login, teacher_name, subject_name, class_name")
    .eq("teacher_login", login)
    .order("subject_name", { ascending: true })
    .order("class_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TeacherAssignment[];
}

export async function getTeacherTodaySchedule(login: string, lessonDate: string) {
  const { data, error } = await supabase
    .from("teacher_schedules")
    .select(
      "id, lesson_date, start_time, end_time, teacher_login, teacher_name, subject_name, class_name, classroom",
    )
    .eq("teacher_login", login)
    .eq("lesson_date", lessonDate)
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TeacherOwnScheduleEntry[];
}

export async function getTeacherVisibleGrades(login: string) {
  const assignments = await getTeacherAssignments(login);

  if (!assignments.length) {
    return [] as TeacherVisibleGrade[];
  }

  const subjectNames = [...new Set(assignments.map((item) => item.subject_name))];

  const { data, error } = await supabase
    .from("student_grades")
    .select(
      "id, student_login, student_email, class_name, subject_name, lesson_name, mark_value, mark_numeric, mark_date",
    )
    .in("subject_name", subjectNames)
    .order("mark_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).filter((grade) =>
    assignments.some(
      (assignment) =>
        assignment.subject_name === grade.subject_name &&
        (!assignment.class_name || !grade.class_name || assignment.class_name === grade.class_name),
    ),
  ) as TeacherVisibleGrade[];
}

export async function getTeacherDashboardData(login: string, lessonDate: string) {
  const [profile, assignments, ownSchedule, visibleGrades, schoolTeacherSchedules, classSchedules] =
    await Promise.all([
      getTeacherProfile(login),
      getTeacherAssignments(login),
      getTeacherTodaySchedule(login, lessonDate),
      getTeacherVisibleGrades(login),
      getTeacherSchedules(lessonDate),
      getClassSchedules(lessonDate),
    ]);

  const criticalZone = getCriticalZoneStudents(
    visibleGrades.map((grade) => ({
      studentLogin: grade.student_login,
      studentEmail: grade.student_email,
      className: grade.class_name,
      subjectName: grade.subject_name,
      markValue: grade.mark_value,
      markNumeric: grade.mark_numeric,
      markDate: grade.mark_date,
    })),
  );

  return {
    profile,
    assignments,
    ownSchedule,
    visibleGrades,
    schoolTeacherSchedules,
    classSchedules,
    criticalZone,
  };
}

export { getClassSchedules, getTeacherSchedules };
