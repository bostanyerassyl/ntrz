export type RoleId = "student" | "teacher" | "parent" | "admin";

export type PortalRole = {
  id: RoleId;
  title: string;
  summary: string;
  accent: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
};

export type HighlightMetric = {
  label: string;
  value: string;
  note: string;
};
