type DashboardMiniListCardProps = {
  label: string;
  title: string;
  items: Array<{
    key: string;
    primary: string;
    secondary: string;
  }>;
  emptyState: string;
};

export function DashboardMiniListCard({
  label,
  title,
  items,
  emptyState,
}: DashboardMiniListCardProps) {
  return (
    <article className="student-card">
      <p className="student-card-label">{label}</p>
      <h2>{title}</h2>
      <div className="student-mini-list">
        {items.length ? (
          items.map((item) => (
            <div key={item.key} className="student-mini-list-item">
              <strong>{item.primary}</strong>
              <span>{item.secondary}</span>
            </div>
          ))
        ) : (
          <div className="student-empty-line">{emptyState}</div>
        )}
      </div>
    </article>
  );
}
