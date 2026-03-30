import type { ReactNode } from "react";

type DashboardSectionCardProps = {
  id?: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function DashboardSectionCard({
  id,
  label,
  title,
  description,
  className,
  children,
}: DashboardSectionCardProps) {
  const sectionClassName = className ? `student-card ${className}` : "student-card";

  return (
    <section className={sectionClassName} id={id}>
      <div className="student-section-heading">
        <div>
          <p className="student-card-label">{label}</p>
          <h2>{title}</h2>
        </div>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
