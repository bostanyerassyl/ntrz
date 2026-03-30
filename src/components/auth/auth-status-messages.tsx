type AuthStatusMessagesProps = {
  successMessage: string | null;
  errorMessage: string | null;
};

export function AuthStatusMessages({
  successMessage,
  errorMessage,
}: AuthStatusMessagesProps) {
  return (
    <>
      {successMessage ? (
        <p className="auth-message auth-message-success">{successMessage}</p>
      ) : null}
      {errorMessage ? <p className="auth-message auth-message-error">{errorMessage}</p> : null}
    </>
  );
}
