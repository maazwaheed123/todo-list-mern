import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TaskList from '../components/TaskList.jsx';
import { ChevronLeftIcon, SearchIcon, SpinnerIcon, CloseIcon } from '../components/Icons.jsx';
import { tasksApi } from '../api/client.js';
import { useTasks } from '../hooks/useTasks.jsx';
import { useUI } from '../hooks/useUI.jsx';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { setStatus, tasks } = useTasks();
  const { openEdit, confirmDelete } = useUI();

  const [term, setTerm] = useState(params.get('q') ?? '');
  const [status, setStatusFilter] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(params.get('q')));
  const [error, setError] = useState(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      setError(null);
      tasksApi
        .list({ search: term.trim(), status })
        .then(setResults)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(handle);
  }, [term, status, tasks]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (term.trim()) next.set('q', term.trim());
    else next.delete('q');
    setParams(next, { replace: true });
  }, [term]);

  const toggle = (task) =>
    setStatus(task.id, task.status === 'completed' ? 'open' : 'completed');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="rounded-lg p-2 text-ink-700 transition hover:bg-white md:hidden"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by title or description"
            aria-label="Search tasks"
            autoFocus
            className="field rounded-xl2 py-3.5 pr-11 shadow-card"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {term ? (
              <button
                type="button"
                onClick={() => setTerm('')}
                aria-label="Clear search"
                className="rounded-lg p-2 text-ink-400 hover:text-ink-700"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            ) : (
              <span className="block p-2 text-ink-400">
                <SearchIcon className="h-[18px] w-[18px]" />
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value || 'all'}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              status === f.value
                ? 'bg-brand-500 text-white'
                : 'bg-white text-ink-500 shadow-card hover:text-ink-900'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-400">
        {loading ? 'Searching...' : `${results.length} task${results.length === 1 ? '' : 's'} found`}
      </p>

      {error && (
        <p className="rounded-xl bg-danger-50 px-4 py-3 text-xs font-medium text-danger-600">
          {error}
        </p>
      )}

      {loading && !results.length ? (
        <div className="flex items-center gap-2 rounded-xl2 bg-white px-4 py-6 text-sm text-ink-400 shadow-card">
          <SpinnerIcon className="h-4 w-4" /> Searching...
        </div>
      ) : (
        <TaskList
          tasks={results}
          onToggle={toggle}
          onEdit={openEdit}
          onDelete={confirmDelete}
          showDate
          empty={{
            title: term ? `No tasks match "${term}"` : 'Start typing to search',
            hint: 'Search looks at both the title and the description.',
          }}
        />
      )}
    </div>
  );
}
