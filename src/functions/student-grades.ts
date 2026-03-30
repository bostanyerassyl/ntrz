import { supabase } from "@/functions/supabase";

export type StudentGradeRow = {
  student_login: string;
  student_email: string | null;
  student_role: string;
  class_name?: string | null;
  kundelik_person_id: number | null;
  kundelik_school_id: number | null;
  kundelik_group_id: number | null;
  kundelik_subject_id: number | null;
  kundelik_lesson_id: number | null;
  kundelik_work_id: number | null;
  subject_name: string | null;
  lesson_name: string | null;
  mark_value: string | null;
  mark_numeric: number | null;
  mark_date: string | null;
  raw_payload: Record<string, unknown>;
};

function readNumber(value: unknown) {
  return typeof value === "number" ? value : null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function readNestedNumber(
  payload: Record<string, unknown>,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    const directValue = payload[key];

    if (typeof directValue === "number") {
      return directValue;
    }
  }

  return null;
}

function readNestedString(
  payload: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const directValue = payload[key];

    if (typeof directValue === "string") {
      return directValue;
    }
  }

  return null;
}

export function mapKundelikMarkToStudentGrade(params: {
  mark: Record<string, unknown>;
  studentLogin: string;
  studentEmail?: string | null;
  studentRole?: string;
  personId?: number | null;
  schoolId?: number | null;
}) {
  const { mark, studentLogin, studentEmail = null, studentRole = "student" } =
    params;

  return {
    student_login: studentLogin,
    student_email: studentEmail,
    student_role: studentRole,
    class_name: readNestedString(mark, "className", "class", "class_name"),
    kundelik_person_id:
      params.personId ?? readNestedNumber(mark, "person", "personId"),
    kundelik_school_id:
      params.schoolId ?? readNestedNumber(mark, "school", "schoolId"),
    kundelik_group_id: readNestedNumber(mark, "group", "groupId", "eduGroupId"),
    kundelik_subject_id: readNestedNumber(mark, "subject", "subjectId"),
    kundelik_lesson_id: readNestedNumber(mark, "lesson", "lessonId"),
    kundelik_work_id: readNestedNumber(mark, "work", "workId"),
    subject_name: readNestedString(mark, "subjectName", "subject"),
    lesson_name: readNestedString(mark, "lessonName", "lesson"),
    mark_value: readNestedString(mark, "value", "mark"),
    mark_numeric: readNumber(mark["numericValue"]),
    mark_date: readString(mark["date"]),
    raw_payload: mark,
  } satisfies StudentGradeRow;
}

export async function saveStudentGrades(grades: StudentGradeRow[]) {
  if (!grades.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("student_grades")
    .insert(grades)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function syncStudentGradesFromKundelik(params: {
  marks: Array<Record<string, unknown>>;
  studentLogin: string;
  studentEmail?: string | null;
  studentRole?: string;
  personId?: number | null;
  schoolId?: number | null;
}) {
  const normalizedGrades = params.marks.map((mark) =>
    mapKundelikMarkToStudentGrade({
      mark,
      studentLogin: params.studentLogin,
      studentEmail: params.studentEmail,
      studentRole: params.studentRole,
      personId: params.personId,
      schoolId: params.schoolId,
    }),
  );

  return saveStudentGrades(normalizedGrades);
}
