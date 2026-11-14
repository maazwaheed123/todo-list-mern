import { weekDays, isSameDay, isToday, formatDayShort } from '../utils/date.js';

export default function DayStrip({ weekDate, selected, onSelect, counts = {} }) {
  const days = weekDays(weekDate);

  return (
    <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 py-1">
      {days.map((day) => {
        const active = isSameDay(day, selected);
        const key = day.toDateString();
        const count = counts[key] ?? 0;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(day)}
            aria-pressed={active}
            className={`flex min-w-0 flex-1 basis-0 flex-col items-center gap-1 rounded-xl px-1 py-2.5 transition md:py-3 ${
              active
                ? 'bg-brand-500 text-white shadow-fab'
                : 'bg-transparent text-ink-400 hover:bg-white'
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide md:text-xs">
              {formatDayShort(day)}
            </span>
            <span
              className={`text-sm font-semibold md:text-base ${
                active ? 'text-white' : isToday(day) ? 'text-brand-600' : 'text-ink-700'
              }`}
            >
              {String(day.getDate()).padStart(2, '0')}
            </span>
            <span
              className={`h-1 w-1 rounded-full ${
                count > 0 ? (active ? 'bg-white' : 'bg-brand-400') : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
