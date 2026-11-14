import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  LayersIcon,
  SearchIcon,
  PlusIcon,
  BellIcon,
  SettingsIcon,
} from './Icons.jsx';
import { useUI } from '../hooks/useUI.jsx';
import { useTasks } from '../hooks/useTasks.jsx';
import { formatDateLong } from '../utils/date.js';

const NAV = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/weeks', label: 'Weeks', icon: LayersIcon },
  { to: '/search', label: 'Search', icon: SearchIcon },
];

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-fab">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 12 5 5L20 6" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink-900">Manage What</p>
          <p className="text-sm font-semibold text-brand-600">To Do</p>
        </div>
      )}
    </div>
  );
}

export default function AppShell({ children }) {
  const { openCreate } = useUI();
  const { error } = useTasks();
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-canvas md:flex">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-ink-300/40 bg-white px-5 py-6 md:flex">
        <Logo />
        <nav className="mt-8 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-ink-500 hover:bg-canvas hover:text-ink-900'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={() => openCreate()} className="btn-primary mt-6 w-full">
          <PlusIcon className="h-4 w-4" />
          New task
        </button>
        <p className="mt-auto pt-6 text-[11px] leading-relaxed text-ink-400">
          {formatDateLong(new Date())}
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-5 pb-1 pt-5 md:hidden">
          <Logo compact />
          <div className="flex items-center gap-1 text-ink-500">
            <NavLink
              to="/search"
              aria-label="Search tasks"
              className="rounded-lg p-2 transition hover:bg-white"
            >
              <SearchIcon className="h-5 w-5" />
            </NavLink>
            <button type="button" aria-label="Notifications" className="rounded-lg p-2 transition hover:bg-white">
              <BellIcon className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Settings" className="rounded-lg p-2 transition hover:bg-white">
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </header>
        {error && (
          <div className="mx-5 mt-3 rounded-xl bg-danger-50 px-4 py-3 text-xs font-medium text-danger-600 md:mx-10">
            {error}
          </div>
        )}
        <main className="mx-auto w-full max-w-[520px] flex-1 px-5 pb-28 pt-4 md:max-w-6xl md:px-10 md:pb-12 md:pt-8">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-300/40 bg-white/95 px-8 py-2 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-[520px] items-center justify-between">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex w-16 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition ${
                    isActive ? 'text-brand-600' : 'text-ink-400'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
        <button
          type="button"
          onClick={() => openCreate()}
          aria-label="Add task"
          className={`fixed bottom-20 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white shadow-fab transition active:scale-95 md:hidden ${
            pathname === '/search' ? 'hidden' : ''
          }`}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
