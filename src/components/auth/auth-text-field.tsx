type AuthTextFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email";
  placeholder: string;
  autoComplete?: string;
};

export function AuthTextField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: AuthTextFieldProps) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}
