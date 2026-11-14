import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DayStrip from '../components/DayStrip.jsx';
import StatCards from '../components/StatCards.jsx';
import WeeklyProgress from '../components/WeeklyProgress.jsx';
import TaskList from '../components/TaskList.jsx';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, SpinnerIcon } from '../components/Icons.jsx';
import { useTasks, useWeekTasks, countBy } from '../hooks/useTasks.jsx';
import { useUI } from '../hooks/useUI.jsx';
import {
  isSameDay,
  isToday,
  addWeeks,
  formatDateLong,
  formatWeekRange,
  startOfWeek,
  endOfWeek,
  weekLabel,
} from '../utils/date.js';

export default function Home() {
  const { loading, setStatus } = useTasks();
  const { openCreate, openEdit, confirmDelete } = useUI();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(() => new Date());
  const [term, setTerm] = useState('');

  const weekTasks = useWeekTasks(selected);
  const stats = countBy(weekTasks);

  const dayTasks = useMemo(
    () => weekTasks.filter((t) => isSameDay(t.dueAt, selected)),
    [weekTasks, selected]
  );

  const restOfWeek = useMemo(
    () => weekTasks.filter((t) => !isSameDay(t.dueAt, selected)),
    [weekTasks, selected]
  );

  const countsByDay = useMemo(() => {
    const map = {};
    weekTasks.forEach((t) => {
      const key = new Date(t.dueAt).toDateString();
      map[key] = (map[key] ?? 0) + 1;
    });
    return map;
  }, [weekTasks]);

  const toggle = (task) =>
    setStatus(task.id, task.status === 'completed' ? 'open' : 'completed');

  const shiftWeek = (amount) => setSelected((d) => addWeeks(d, amount));

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(term.trim() ? `/search?q=${encodeURIComponent(term.trim())}` : '/search');
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="hidden items-end justify-between md:flex">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Manage What To Do</h1>
          <p className="mt-1 text-sm text-ink-500">{formatDateLong(new Date())}</p>
        </div>
        <form onSubmit={submitSearch} className="relative w-72">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for a task"
            aria-label="Search for a task"
            className="field pr-10"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400 hover:text-brand-600"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </form>
      </div>

      <form onSubmit={submitSearch} className="relative md:hidden">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for a task"
          aria-label="Search for a task"
          className="field rounded-xl2 py-3.5 pr-11 shadow-card"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </button>
      </form>

      <section className="rounded-xl2 bg-white p-2 shadow-card md:p-3">
        <div className="flex items-center justify-between px-2 pb-1 pt-1">
          <button
            type="button"
            onClick={() => shiftWeek(-1)}
            aria-label="Previous week"
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-canvas hover:text-ink-700"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold text-ink-900">{weekLabel(selected)}</p>
            <p className="text-[10px] text-ink-400">
              {formatWeekRange(startOfWeek(selected), endOfWeek(selected))}
            </p>
          </div>
          <button
            type="button"
            onClick={() => shiftWeek(1)}
            aria-label="Next week"
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-canvas hover:text-ink-700"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <DayStrip
          weekDate={selected}
          selected={selected}
          onSelect={setSelected}
          counts={countsByDay}
        />
      </section>

      <StatCards
        completed={stats.completed}
        pending={stats.open}
        total={stats.total}
        caption={weekLabel(selected)}
      />

      <WeeklyProgress completed={stats.completed} total={stats.total} />

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <section className="md:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink-900">
              {isToday(selected) ? 'Tasks Today' : formatDateLong(selected)}
            </h2>
            <Link to="/weeks" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 rounded-xl2 bg-white px-4 py-6 text-sm text-ink-400 shadow-card">
              <SpinnerIcon className="h-4 w-4" /> Loading tasks...
            </div>
          ) : (
            <TaskList
              tasks={dayTasks}
              onToggle={toggle}
              onEdit={openEdit}
              onDelete={confirmDelete}
              empty={{
                title: 'No tasks for this day',
                hint: 'Tap the + button to add your first task.',
              }}
            />
          )}

          <button
            type="button"
            onClick={() => openCreate(selected)}
            className="btn-ghost mt-3 hidden w-full md:inline-flex"
          >
            + Add a task for {formatDateLong(selected)}
          </button>
        </section>

        <section className="mt-6 hidden md:col-span-1 md:mt-0 md:block">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">Rest of the week</h2>
          <TaskList
            tasks={restOfWeek}
            onToggle={toggle}
            onEdit={openEdit}
            onDelete={confirmDelete}
            showDate
            empty={{ title: 'Nothing else scheduled', hint: 'This week is clear.' }}
          />
        </section>
      </div>
    </div>
  );
}
