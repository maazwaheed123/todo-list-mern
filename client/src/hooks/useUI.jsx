import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TaskFormModal from '../components/TaskFormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Toast from '../components/Toast.jsx';
import { useTasks } from './useTasks.jsx';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const { createTask, updateTask, deleteTask } = useTasks();

  const [form, setForm] = useState({ open: false, task: null, date: null });
  const [pendingDelete, setPendingDelete] = useState(null);

  const openCreate = useCallback((date) => setForm({ open: true, task: null, date }), []);
  const openEdit = useCallback((task) => setForm({ open: true, task, date: null }), []);
  const closeForm = useCallback(() => setForm((f) => ({ ...f, open: false })), []);
  const confirmDelete = useCallback((task) => setPendingDelete(task), []);

  const handleSubmit = useCallback(
    async (payload) => {
      if (form.task) {
        await updateTask(form.task.id, payload);
      } else {
        const { status, ...rest } = payload;
        await createTask(rest);
      }
    },
    [form.task, createTask, updateTask]
  );

  const value = useMemo(
    () => ({ openCreate, openEdit, confirmDelete }),
    [openCreate, openEdit, confirmDelete]
  );

  return (
    <UIContext.Provider value={value}>
      {children}

      <TaskFormModal
        open={form.open}
        task={form.task}
        defaultDate={form.date}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this task?"
        message={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed permanently. This cannot be undone.`
            : ''
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteTask(pendingDelete.id);
          setPendingDelete(null);
        }}
      />

      <Toast />
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used inside <UIProvider>');
  return context;
}
