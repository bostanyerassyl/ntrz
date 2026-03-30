type RatingGradeInput = {
  markValue?: string | null;
  markNumeric?: number | null;
  markDate?: string | null;
};

const ratingWeights: Record<string, number> = {
  "5": 5,
  "4": 4,
  "3": 2.8,
  "2": 1.4,
};

function resolveGradeValue(grade: RatingGradeInput) {
  if (typeof grade.markNumeric === "number") {
    return String(Math.round(grade.markNumeric));
  }

  if (grade.markValue) {
    return grade.markValue.trim();
  }

  return "";
}

function getRecencyBonus(markDate?: string | null) {
  if (!markDate) {
    return 0;
  }

  const gradeDate = new Date(markDate);
  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - gradeDate.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffInDays <= 7) {
    return 0.45;
  }

  if (diffInDays <= 30) {
    return 0.2;
  }

  return 0;
}

export function calculateStudentRating(grades: RatingGradeInput[]) {
  return Math.round(
    grades.reduce((score, grade) => {
      const gradeValue = resolveGradeValue(grade);
      const baseWeight = ratingWeights[gradeValue] ?? 0;

      return score + baseWeight + getRecencyBonus(grade.markDate);
    }, 0),
  );
}

export function maskStudentLogin(login: string) {
  if (login.length <= 2) {
    return `${login[0] ?? "*"}*`;
  }

  return `${login.slice(0, 2)}${"*".repeat(Math.max(2, login.length - 2))}`;
}
