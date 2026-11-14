export default function WeeklyProgress({ completed, total, label = 'Weekly Progress' }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-ink-900">{label}</h2>
        <span className="text-xs font-medium text-ink-400">
          {completed}/{total} done · {percent}%
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-white shadow-card"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}
