"use client";

import { Children, useMemo, useState, type ReactNode } from "react";

import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { getTableVisibilityCopy, type LanguageCode } from "@/functions/language";

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
  language: LanguageCode;
  rowsPerPage?: number;
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
  language,
  rowsPerPage = 5,
  children,
}: DashboardTableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tableRows = useMemo(() => Children.toArray(children), [children]);
  const visibleRows = isExpanded ? tableRows : tableRows.slice(0, rowsPerPage);
  const toggleCopy = getTableVisibilityCopy(language);
  const hasToggle = hasData && tableRows.length > rowsPerPage;

  return (
    <DashboardSectionCard
      id={id}
      label={label}
      title={title}
      description={description}
    >
      <div
        className={`student-table-wrap student-table-wrap-limited${
          isExpanded ? " is-expanded" : ""
        }${compact ? " is-compact" : ""}`}
      >
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
              visibleRows
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
      {hasToggle ? (
        <button
          className="student-inline-button student-table-toggle"
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? toggleCopy.showLess : toggleCopy.showMore}
        </button>
      ) : null}
    </DashboardSectionCard>
  );
}
