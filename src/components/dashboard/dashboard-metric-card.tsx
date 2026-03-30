type DashboardMetricCardProps = {
  label: string;
  title: string;
  value: string | number;
};

export function DashboardMetricCard({
  label,
  title,
  value,
}: DashboardMetricCardProps) {
  return (
    <article className="student-card student-card-rating">
      <p className="student-card-label">{label}</p>
      <h2>{title}</h2>
      <p className="student-rating-value">{value}</p>
    </article>
  );
}
