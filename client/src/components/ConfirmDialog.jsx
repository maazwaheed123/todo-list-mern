import { useEffect } from 'react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div className="absolute inset-0 animate-fade-in bg-ink-900/40" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-sm animate-pop-in rounded-2xl bg-white p-5 shadow-sheet"
      >
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        <p className="mt-1.5 text-sm text-ink-500">{message}</p>
        <div className="mt-5 flex gap-3">
          <button type="button" className="btn-ghost flex-1" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl bg-danger-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-danger-600"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
