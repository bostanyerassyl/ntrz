type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div style={{ display: "grid", gap: "18px" }}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      <p className="muted-copy" style={{ margin: 0, maxWidth: 720 }}>
        {description}
      </p>
    </div>
  );
}
