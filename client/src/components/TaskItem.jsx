import { useRef, useState } from 'react';
import { CheckIcon, EditIcon, TrashIcon, ClockIcon } from './Icons.jsx';
import { formatTime, formatMonthDay } from '../utils/date.js';

const PRIORITY_STYLES = {
  high: 'bg-danger-50 text-danger-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-emerald-50 text-emerald-600',
};

const REVEAL = 88;

export default function TaskItem({ task, onToggle, onEdit, onDelete, showDate = false }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);
  const completed = task.status === 'completed';
  const handleTouchStart = (e) => {
    start.current = { x: e.touches[0].clientX, offset };
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!start.current) return;
    const delta = e.touches[0].clientX - start.current.x;
    const next = Math.min(0, Math.max(-REVEAL, start.current.offset + delta));
    setOffset(next);
  };
  const handleTouchEnd = () => {
    setDragging(false);
    setOffset((current) => (current < -REVEAL / 2 ? -REVEAL : 0));
    start.current = null;
  };
  return (
    <li className="relative overflow-hidden rounded-xl2 bg-white shadow-card">
      <button
        type="button"
        onClick={() => {
          setOffset(0);
          onDelete(task);
        }}
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-danger-500 text-xs font-semibold text-white"
        tabIndex={-1}
        aria-hidden={offset === 0}
      >
        Delete
      </button>
      <div
        className={`relative flex items-center gap-3 bg-white px-4 py-3.5 ${
          dragging ? '' : 'transition-transform duration-200'
        }`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => onToggle(task)}
          aria-label={completed ? `Mark "${task.title}" as open` : `Mark "${task.title}" as completed`}
          aria-pressed={completed}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition ${
            completed
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-ink-300 bg-white text-transparent hover:border-brand-400'
          }`}
        >
          <CheckIcon className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={`truncate text-sm font-medium ${
              completed ? 'text-ink-400 line-through' : 'text-ink-900'
            }`}
          >
            {task.title}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-400">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {showDate && `${formatMonthDay(task.dueAt)}, `}
              {formatTime(task.dueAt)}
              {task.endAt ? ` - ${formatTime(task.endAt)}` : ''}
            </span>
            {task.status === 'in_progress' && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-600">
                In progress
              </span>
            )}
            {task.priority && task.priority !== 'medium' && (
              <span
                className={`rounded-full px-2 py-0.5 font-medium capitalize ${
                  PRIORITY_STYLES[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete "${task.title}"`}
            className="rounded-lg p-2 text-ink-400 transition hover:bg-danger-50 hover:text-danger-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-600"
          >
            <EditIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
