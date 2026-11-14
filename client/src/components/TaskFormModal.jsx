import { useEffect, useState } from 'react';
import { CloseIcon, ClockIcon, CalendarIcon, SpinnerIcon } from './Icons.jsx';
import { toDateInput, toTimeInput, toISO } from '../utils/date.js';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

const emptyForm = (date) => ({
  title: '',
  description: '',
  date: toDateInput(date || new Date()),
  start: '09:00',
  end: '',
  priority: 'medium',
  status: 'open',
});

export default function TaskFormModal({ open, task, defaultDate, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm(defaultDate));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(task);
  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      task
        ? {
            title: task.title,
            description: task.description || '',
            date: toDateInput(task.dueAt),
            start: toTimeInput(task.dueAt),
            end: toTimeInput(task.endAt),
            priority: task.priority || 'medium',
            status: task.status || 'open',
          }
        : emptyForm(defaultDate)
    );
  }, [open, task, defaultDate]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError('Task title is required.');
    if (!form.date) return setError('Please pick a date.');

    const dueAt = toISO(form.date, form.start || '00:00');
    const endAt = form.end ? toISO(form.date, form.end) : null;
    if (endAt && new Date(endAt) < new Date(dueAt)) {
      return setError('The end time cannot be before the start time.');
    }
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        dueAt,
        endAt,
        priority: form.priority,
        status: form.status,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 animate-fade-in bg-ink-900/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit task' : 'Add new task'}
        className="relative max-h-[92vh] w-full animate-sheet-up overflow-y-auto rounded-t-3xl bg-white p-5 shadow-sheet md:max-w-lg md:animate-pop-in md:rounded-3xl md:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-canvas hover:text-ink-700"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="task-title">
              Task title
            </label>
            <input
              id="task-title"
              className="field"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Doing Homework"
              maxLength={140}
              autoFocus
            />
          </div>
          <div>
            <span className="field-label">Set Time</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="time"
                  aria-label="Start time"
                  className="field pl-9"
                  value={form.start}
                  onChange={set('start')}
                />
              </div>
              <div className="relative">
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="time"
                  aria-label="End time"
                  className="field pl-9"
                  value={form.end}
                  onChange={set('end')}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="task-date">
              Set Date
            </label>
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                id="task-date"
                type="date"
                className="field pl-9"
                value={form.date}
                onChange={set('date')}
              />
            </div>
          </div>
          <div>
            <span className="field-label">Priority</span>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                    form.priority === p.value
                      ? 'border-brand-500 bg-brand-50 text-brand-600'
                      : 'border-ink-300/60 bg-white text-ink-500 hover:border-brand-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {isEdit && (
            <div>
              <span className="field-label">Status</span>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s.value }))}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition ${
                      form.status === s.value
                        ? 'border-brand-500 bg-brand-50 text-brand-600'
                        : 'border-ink-300/60 bg-white text-ink-500 hover:border-brand-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="field-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              className="field min-h-[88px] resize-y"
              value={form.description}
              onChange={set('description')}
              placeholder="Add Description"
              maxLength={2000}
            />
          </div>
          {error && (
            <p className="rounded-xl bg-danger-50 px-3 py-2 text-xs font-medium text-danger-600">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving && <SpinnerIcon className="h-4 w-4" />}
            {isEdit ? 'Save changes' : 'Create task'}
          </button>
        </form>
      </div>
    </div>
  );
}
