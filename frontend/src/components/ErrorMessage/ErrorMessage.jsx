function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message-card">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <div>
        <h3>Something went wrong</h3>
        <p>{message}</p>
        <button onClick={onRetry} className="button button-primary">
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;
