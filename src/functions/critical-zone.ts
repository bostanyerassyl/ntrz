type CriticalZoneGradeInput = {
  studentLogin: string;
  studentEmail?: string | null;
  className?: string | null;
  subjectName?: string | null;
  markValue?: string | null;
  markNumeric?: number | null;
  markDate?: string | null;
};

export type CriticalZoneEntry = {
  studentLogin: string;
  studentEmail: string | null;
  className: string | null;
  subjectName: string | null;
  averageScore: number;
  gradesCount: number;
  latestMark: string | null;
  latestDate: string | null;
  riskLevel: "critical" | "warning";
};

function resolveNumericMark(grade: CriticalZoneGradeInput) {
  if (typeof grade.markNumeric === "number" && Number.isFinite(grade.markNumeric)) {
    return grade.markNumeric;
  }

  if (!grade.markValue) {
    return null;
  }

  const parsedValue = Number.parseFloat(grade.markValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function calculateAverageScore(grades: CriticalZoneGradeInput[]) {
  const numericMarks = grades
    .map((grade) => resolveNumericMark(grade))
    .filter((mark): mark is number => typeof mark === "number");

  if (!numericMarks.length) {
    return null;
  }

  const totalScore = numericMarks.reduce((sum, mark) => sum + mark, 0);

  return Number((totalScore / numericMarks.length).toFixed(2));
}

export function getCriticalZoneStudents(
  grades: CriticalZoneGradeInput[],
  threshold = 3.5,
) {
  const gradesByStudent = new Map<string, CriticalZoneGradeInput[]>();

  for (const grade of grades) {
    const currentGrades = gradesByStudent.get(grade.studentLogin) ?? [];
    currentGrades.push(grade);
    gradesByStudent.set(grade.studentLogin, currentGrades);
  }

  return Array.from(gradesByStudent.entries())
    .map(([studentLogin, studentGrades]) => {
      const averageScore = calculateAverageScore(studentGrades);

      if (averageScore === null || averageScore >= threshold) {
        return null;
      }

      const latestGrade = [...studentGrades].sort((left, right) =>
        (right.markDate ?? "").localeCompare(left.markDate ?? ""),
      )[0];

      return {
        studentLogin,
        studentEmail: studentGrades[0]?.studentEmail ?? null,
        className: studentGrades[0]?.className ?? null,
        subjectName: studentGrades[0]?.subjectName ?? null,
        averageScore,
        gradesCount: studentGrades.length,
        latestMark: latestGrade?.markValue ?? null,
        latestDate: latestGrade?.markDate ?? null,
        riskLevel: averageScore < 3 ? "critical" : "warning",
      } satisfies CriticalZoneEntry;
    })
    .filter((entry): entry is CriticalZoneEntry => entry !== null)
    .sort((left, right) => left.averageScore - right.averageScore);
}
