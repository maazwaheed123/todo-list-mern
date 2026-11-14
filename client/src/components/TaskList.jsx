import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, showDate, empty }) {
  if (!tasks.length) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink-300/70 bg-white/60 px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink-700">{empty?.title ?? 'Nothing here yet'}</p>
        {empty?.hint && <p className="mt-1 text-xs text-ink-400">{empty.hint}</p>}
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          showDate={showDate}
        />
      ))}
    </ul>
  );
}
