import type { ReactNode } from "react";

import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";

type DashboardTableCardProps = {
  id: string;
  label: string;
  title: string;
  description?: string;
  headers: string[];
  emptyState: string;
  emptyColSpan: number;
  hasData: boolean;
  compact?: boolean;
  children: ReactNode;
};

export function DashboardTableCard({
  id,
  label,
  title,
  description,
  headers,
  emptyState,
  emptyColSpan,
  hasData,
  compact = false,
  children,
}: DashboardTableCardProps) {
  return (
    <DashboardSectionCard
      id={id}
      label={label}
      title={title}
      description={description}
    >
      <div className="student-table-wrap">
        <table className={`student-table${compact ? " student-table-compact" : ""}`}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              children
            ) : (
              <tr>
                <td colSpan={emptyColSpan} className="student-empty-row">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardSectionCard>
  );
}
