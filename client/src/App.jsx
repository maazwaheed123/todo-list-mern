import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import Home from './pages/Home.jsx';
import Weeks from './pages/Weeks.jsx';
import Search from './pages/Search.jsx';
import Onboarding from './pages/Onboarding.jsx';
import { TasksProvider } from './hooks/useTasks.jsx';
import { UIProvider } from './hooks/useUI.jsx';

const ONBOARDED_KEY = 'todo-app:onboarded';

export default function App() {
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDED_KEY) === 'true'
  );

  if (!onboarded) {
    return (
      <Onboarding
        onStart={() => {
          localStorage.setItem(ONBOARDED_KEY, 'true');
          setOnboarded(true);
        }}
      />
    );
  }

  return (
    <TasksProvider>
      <UIProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weeks" element={<Weeks />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </UIProvider>
    </TasksProvider>
  );
}
