import { useEffect, useMemo, useState } from 'react';
import WeekCard from '../components/WeekCard.jsx';
import { SpinnerIcon, PlusIcon } from '../components/Icons.jsx';
import { tasksApi } from '../api/client.js';
import { useTasks } from '../hooks/useTasks.jsx';
import { useUI } from '../hooks/useUI.jsx';
import { startOfWeek } from '../utils/date.js';

export default function Weeks() {
  const { tasks, setStatus } = useTasks();
  const { openCreate, openEdit, confirmDelete } = useUI();

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(() => startOfWeek(new Date()).toDateString());

  useEffect(() => {
    let cancelled = false;
    tasksApi
      .weeklySummary()
      .then((data) => !cancelled && setWeeks(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tasks]);

  const tasksByWeek = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      const key = startOfWeek(task.dueAt).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(task);
    });
    return map;
  }, [tasks]);

  const toggle = (task) =>
    setStatus(task.id, task.status === 'completed' ? 'open' : 'completed');

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink-900 md:text-2xl">All Tasks by Week</h1>
          <p className="mt-1 text-xs text-ink-500 md:text-sm">
            Weeks run Monday to Sunday. Tap a card to see its tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="btn-primary hidden md:inline-flex"
        >
          <PlusIcon className="h-4 w-4" />
          New task
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-danger-50 px-4 py-3 text-xs font-medium text-danger-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl2 bg-white px-4 py-6 text-sm text-ink-400 shadow-card">
          <SpinnerIcon className="h-4 w-4" /> Loading weeks...
        </div>
      ) : (
        <div className="grid items-start gap-3 md:grid-cols-2">
          {weeks.map((week) => {
            const key = new Date(week.weekStart).toDateString();
            return (
              <WeekCard
                key={week.weekKey}
                week={week}
                tasks={tasksByWeek.get(key) ?? []}
                expanded={expanded === key}
                onToggleExpand={() => setExpanded((cur) => (cur === key ? null : key))}
                onToggle={toggle}
                onEdit={openEdit}
                onDelete={confirmDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
