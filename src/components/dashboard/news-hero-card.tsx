type NewsHeroCardProps = {
  id: string;
  label: string;
  title: string;
  description: string;
  secondaryTitle: string;
  emptyState: string;
};

export function NewsHeroCard({
  id,
  label,
  title,
  description,
  secondaryTitle,
  emptyState,
}: NewsHeroCardProps) {
  return (
    <article className="student-card student-card-news" id={id}>
      <p className="student-card-label">{label}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="student-news-mini-grid">
        <div className="student-news-mini-card">
          <strong>{title}</strong>
          <span>{emptyState}</span>
        </div>
        <div className="student-news-mini-card">
          <strong>{secondaryTitle}</strong>
          <span>{emptyState}</span>
        </div>
      </div>
    </article>
  );
}
