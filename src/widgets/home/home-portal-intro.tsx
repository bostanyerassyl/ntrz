import { portalHighlights, portalRoles } from "@/entities/portal/model/data";
import { getRiskSummary } from "@/features/portal-overview/model/get-risk-summary";
import { Panel } from "@/shared/ui/panel";
import { SectionHeading } from "@/shared/ui/section-heading";

const riskSummary = getRiskSummary();

export function HomePortalIntro() {
  return (
    <main className="page-shell" style={{ padding: "28px 0 72px" }}>
      <div className="content-width" style={{ display: "grid", gap: 28 }}>
        <section
          className="glass-card"
          style={{
            padding: "28px",
            display: "grid",
            gap: "28px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="eyebrow">School Portal Foundation</span>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              <span>Next.js</span>
              <span>TypeScript</span>
              <span>App Router</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            <div style={{ display: "grid", gap: "18px" }}>
              <h1 className="display-title">
                Aqbobek Lyceum
                <br />
                digital campus.
              </h1>
              <p className="muted-copy" style={{ margin: 0, maxWidth: 680 }}>
                The project starts with a strong frontend base: separated domain
                logic, reusable visual blocks, and role-ready sections for
                student, teacher, parent, and administration flows.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  paddingTop: 8,
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 999,
                    background: "var(--brand)",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Role-based dashboards
                </div>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 999,
                    border: "1px solid var(--line)",
                    background: "rgba(255,255,255,0.6)",
                    fontWeight: 600,
                  }}
                >
                  BilimClass-ready logic
                </div>
              </div>
            </div>

            <Panel>
              <div
                style={{
                  padding: "22px",
                  display: "grid",
                  gap: "18px",
                  height: "100%",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--brand-strong)",
                      fontWeight: 700,
                    }}
                  >
                    Teacher risk logic
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-display), serif",
                      fontSize: "2rem",
                      lineHeight: 1,
                    }}
                  >
                    {riskSummary.sampleCount}
                  </p>
                </div>
                <p className="muted-copy" style={{ margin: 0 }}>
                  {riskSummary.action}. Threshold: {riskSummary.threshold}.
                </p>
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    marginTop: "auto",
                  }}
                >
                  {portalHighlights.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 18,
                        background: "rgba(255, 250, 241, 0.7)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "baseline",
                        }}
                      >
                        <strong>{item.label}</strong>
                        <span style={{ color: "var(--brand-strong)", fontWeight: 700 }}>
                          {item.value}
                        </span>
                      </div>
                      <p className="muted-copy" style={{ margin: "6px 0 0", fontSize: 14 }}>
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </section>

        <section style={{ display: "grid", gap: 20 }}>
          <SectionHeading
            eyebrow="Portal roles"
            title="A modular base for every user type"
            description="Each role already has its own domain entry in the codebase, which makes it straightforward to split future dashboards into isolated features and widgets without mixing business logic with visual components."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            {portalRoles.map((role) => (
              <Panel key={role.id}>
                <div style={{ padding: "22px", display: "grid", gap: 18 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: `${role.accent}22`,
                      border: `1px solid ${role.accent}33`,
                    }}
                  />
                  <div style={{ display: "grid", gap: 10 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display), serif",
                        fontSize: "1.65rem",
                        lineHeight: 1,
                      }}
                    >
                      {role.title}
                    </h3>
                    <p className="muted-copy" style={{ margin: 0, fontSize: 15 }}>
                      {role.summary}
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {role.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          paddingTop: 10,
                          borderTop: "1px solid var(--line)",
                          fontSize: 14,
                        }}
                      >
                        <span style={{ color: "var(--muted)" }}>{metric.label}</span>
                        <strong>{metric.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
