export function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
