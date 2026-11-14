import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tasksApi } from '../api/client.js';
import { startOfWeek, endOfWeek } from '../utils/date.js';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, tone = 'info') => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await tasksApi.list();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = useCallback(
    async (payload) => {
      const task = await tasksApi.create(payload);
      setTasks((prev) => [...prev, task]);
      notify('Task created', 'success');
      return task;
    },
    [notify]
  );

  const updateTask = useCallback(
    async (id, payload) => {
      const task = await tasksApi.update(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      notify('Task updated', 'success');
      return task;
    },
    [notify]
  );

  const setStatus = useCallback(
    async (id, status) => {
      const previous = tasks;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      try {
        const task = await tasksApi.setStatus(id, status);
        setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      } catch (err) {
        setTasks(previous);
        notify(err.message, 'error');
      }
    },
    [tasks, notify]
  );

  const deleteTask = useCallback(
    async (id) => {
      const previous = tasks;
      setTasks((prev) => prev.filter((t) => t.id !== id));
      try {
        await tasksApi.remove(id);
        notify('Task deleted', 'success');
      } catch (err) {
        setTasks(previous);
        notify(err.message, 'error');
      }
    },
    [tasks, notify]
  );

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      toast,
      notify,
      dismissToast: () => setToast(null),
      refresh,
      createTask,
      updateTask,
      deleteTask,
      setStatus,
    }),
    [tasks, loading, error, toast, notify, refresh, createTask, updateTask, deleteTask, setStatus]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used inside <TasksProvider>');
  return context;
}

export function useWeekTasks(date) {
  const { tasks } = useTasks();
  return useMemo(() => {
    const from = startOfWeek(date).getTime();
    const to = endOfWeek(date).getTime();
    return tasks.filter((t) => {
      const due = new Date(t.dueAt).getTime();
      return due >= from && due <= to;
    });
  }, [tasks, date]);
}

export const countBy = (tasks) => ({
  total: tasks.length,
  completed: tasks.filter((t) => t.status === 'completed').length,
  open: tasks.filter((t) => t.status !== 'completed').length,
  inProgress: tasks.filter((t) => t.status === 'in_progress').length,
});
