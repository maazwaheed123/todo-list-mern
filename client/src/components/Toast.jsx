import { useEffect } from 'react';
import { useTasks } from '../hooks/useTasks.jsx';

export default function Toast() {
  const { toast, dismissToast } = useTasks();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(dismissToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const tones = {
    success: 'bg-ink-900 text-white',
    error: 'bg-danger-500 text-white',
    info: 'bg-ink-900 text-white',
  };

  return (
    <div
      role="status"
      className={`pointer-events-none fixed inset-x-0 bottom-24 z-[70] mx-auto w-fit max-w-[90vw] animate-pop-in rounded-full px-4 py-2.5 text-xs font-medium shadow-sheet md:bottom-8 ${
        tones[toast.tone] ?? tones.info
      }`}
    >
      {toast.message}
    </div>
  );
}
