import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";

type ProfileCardProps = {
  id: string;
  sectionLabel: string;
  title: string;
  description: string;
  loginLabel: string;
  emailLabel: string;
  roleLabel: string;
  passwordLabel: string;
  showHashLabel: string;
  hideHashLabel: string;
  login: string;
  email: string;
  role: string;
  passwordHash: string | null;
  isHashVisible: boolean;
  onToggleHash: () => void;
};

export function ProfileCard({
  id,
  sectionLabel,
  title,
  description,
  loginLabel,
  emailLabel,
  roleLabel,
  passwordLabel,
  showHashLabel,
  hideHashLabel,
  login,
  email,
  role,
  passwordHash,
  isHashVisible,
  onToggleHash,
}: ProfileCardProps) {
  return (
    <DashboardSectionCard
      id={id}
      label={sectionLabel}
      title={title}
      description={description}
    >
      <div className="student-profile-grid">
        <div className="student-profile-item">
          <span>{loginLabel}</span>
          <strong>{login}</strong>
        </div>
        <div className="student-profile-item">
          <span>{emailLabel}</span>
          <strong>{email}</strong>
        </div>
        <div className="student-profile-item">
          <span>{roleLabel}</span>
          <strong>{role}</strong>
        </div>
        <div className="student-profile-item">
          <span>{passwordLabel}</span>
          <div className="student-password-hash">
            <strong>{isHashVisible ? passwordHash ?? "-" : "********************"}</strong>
            <button
              className="student-inline-button"
              type="button"
              onClick={onToggleHash}
            >
              {isHashVisible ? hideHashLabel : showHashLabel}
            </button>
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}
