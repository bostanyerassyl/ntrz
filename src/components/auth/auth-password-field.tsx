type AuthPasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
  isVisible: boolean;
  showLabel: string;
  hideLabel: string;
  onToggleVisibility: () => void;
};

export function AuthPasswordField({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  isVisible,
  showLabel,
  hideLabel,
  onToggleVisibility,
}: AuthPasswordFieldProps) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <div className="password-input-wrap">
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button className="password-toggle" type="button" onClick={onToggleVisibility}>
          {isVisible ? hideLabel : showLabel}
        </button>
      </div>
    </label>
  );
}
