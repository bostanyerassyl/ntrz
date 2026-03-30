import { portalRoles } from "@/entities/portal/model/data";

export function getRiskSummary() {
  const teacherRole = portalRoles.find((role) => role.id === "teacher");

  return {
    threshold: "Below 3.0 GPA or falling trend",
    action: "Teacher sees students that need immediate intervention",
    sampleCount:
      teacherRole?.metrics.find((metric) => metric.label === "Risk students")
        ?.value ?? "0",
  };
}
