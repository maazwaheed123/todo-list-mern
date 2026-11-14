import { getRepo } from '../store/index.js';
import { STATUSES, PRIORITIES } from '../models/Task.js';
import { startOfWeek, endOfWeek, weekKey } from '../utils/week.js';

const badRequest = (message) => {
  const err = new Error(message);
  err.status = 400;
  return err;
};

function pickTaskFields(body, { partial = false } = {}) {
  const data = {};

  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.description !== undefined) data.description = String(body.description).trim();

  if (body.dueAt !== undefined) {
    const d = new Date(body.dueAt);
    if (Number.isNaN(d.getTime())) throw badRequest('dueAt must be a valid date');
    data.dueAt = d;
  }

  if (body.endAt !== undefined) {
    if (body.endAt === null || body.endAt === '') {
      data.endAt = null;
    } else {
      const d = new Date(body.endAt);
      if (Number.isNaN(d.getTime())) throw badRequest('endAt must be a valid date');
      data.endAt = d;
    }
  }

  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      throw badRequest(`priority must be one of: ${PRIORITIES.join(', ')}`);
    }
    data.priority = body.priority;
  }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      throw badRequest(`status must be one of: ${STATUSES.join(', ')}`);
    }
    data.status = body.status;
    data.completedAt = body.status === 'completed' ? new Date() : null;
  }

  if (!partial) {
    if (!data.title) throw badRequest('Title is required');
    if (!data.dueAt) throw badRequest('Date & time is required');
  }

  if (data.dueAt && data.endAt && data.endAt < data.dueAt) {
    throw badRequest('End time cannot be before the start time');
  }

  return data;
}

export async function listTasks(req, res, next) {
  try {
    const { search, q, status, from, to } = req.query;
    const tasks = await getRepo().list({
      search: search || q,
      status,
      from,
      to,
    });
    res.json({ data: tasks, count: tasks.length });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await getRepo().get(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const data = pickTaskFields(req.body ?? {});
    const task = await getRepo().create(data);
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const data = pickTaskFields(req.body ?? {}, { partial: true });
    if (Object.keys(data).length === 0) throw badRequest('No valid fields to update');

    const task = await getRepo().update(req.params.id, data);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body ?? {};
    if (!STATUSES.includes(status)) {
      throw badRequest(`status must be one of: ${STATUSES.join(', ')}`);
    }
    const task = await getRepo().update(req.params.id, {
      status,
      completedAt: status === 'completed' ? new Date() : null,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await getRepo().remove(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function weeklySummary(req, res, next) {
  try {
    const tasks = await getRepo().list({});
    const weeks = new Map();
    const ensureWeek = (date) => {
      const key = weekKey(date);
      if (!weeks.has(key)) {
        weeks.set(key, {
          weekKey: key,
          weekStart: startOfWeek(date).toISOString(),
          weekEnd: endOfWeek(date).toISOString(),
          total: 0,
          open: 0,
          inProgress: 0,
          completed: 0,
        });
      }
      return weeks.get(key);
    };
    ensureWeek(new Date());

    for (const task of tasks) {
      const week = ensureWeek(task.dueAt);
      week.total += 1;
      if (task.status === 'completed') week.completed += 1;
      else if (task.status === 'in_progress') week.inProgress += 1;
      else week.open += 1;
    }
    const data = [...weeks.values()]
      .map((w) => ({
        ...w,
        openTotal: w.open + w.inProgress,
        progress: w.total ? Math.round((w.completed / w.total) * 100) : 0,
      }))
      .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
