import TaskList from './TaskList.jsx';
import { ChevronDownIcon } from './Icons.jsx';
import { formatWeekRange, weekLabel } from '../utils/date.js';

const pad = (n) => String(n).padStart(2, '0');

export default function WeekCard({ week, tasks, expanded, onToggleExpand, onToggle, onEdit, onDelete }) {
  const percent = week.total ? Math.round((week.completed / week.total) * 100) : 0;

  return (
    <article className="overflow-hidden rounded-xl2 bg-white shadow-card">
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-canvas/60"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">{weekLabel(week.weekStart)}</p>
          <p className="mt-0.5 text-[11px] text-ink-400">
            {formatWeekRange(week.weekStart, week.weekEnd)}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-danger-50 px-2.5 py-1 text-[11px] font-medium text-danger-600">
              {pad(week.openTotal)} Open
            </span>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-600">
              {pad(week.completed)} Completed
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-ink-300/30 bg-canvas/50 p-3">
          <TaskList
            tasks={tasks}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            showDate
            empty={{ title: 'No tasks in this week' }}
          />
        </div>
      )}
    </article>
  );
}
