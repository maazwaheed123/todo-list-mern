import { SquareCheckIcon, SquareXIcon, LayersIcon } from './Icons.jsx';

const pad = (n) => String(n).padStart(2, '0');

function StatCard({ icon: Icon, label, value, caption, tone }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    danger: 'bg-danger-50 text-danger-600',
    neutral: 'bg-white text-ink-700',
  };

  return (
    <div className={`rounded-xl2 px-4 py-3.5 shadow-card ${tones[tone]}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold leading-none md:text-3xl">{pad(value)}</p>
      <p className="mt-1.5 text-[10px] font-medium opacity-70">{caption}</p>
    </div>
  );
}

export default function StatCards({ completed, pending, total, caption = 'This Week' }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <StatCard
        icon={SquareCheckIcon}
        label="Task Complete"
        value={completed}
        caption={caption}
        tone="brand"
      />
      <StatCard
        icon={SquareXIcon}
        label="Task Pending"
        value={pending}
        caption={caption}
        tone="danger"
      />
      <div className="hidden md:block">
        <StatCard
          icon={LayersIcon}
          label="Total Tasks"
          value={total}
          caption={caption}
          tone="neutral"
        />
      </div>
    </div>
  );
}
