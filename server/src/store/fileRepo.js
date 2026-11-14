import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PRIORITIES, STATUSES } from '../models/Task.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'tasks.json');
function read() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function write(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}
const iso = (v) => (v ? new Date(v).toISOString() : null);

function validate(data, { partial = false } = {}) {
  if (!partial || data.title !== undefined) {
    if (!data.title || !String(data.title).trim()) {
      const err = new Error('Title is required');
      err.status = 400;
      throw err;
    }
  }
  if (!partial || data.dueAt !== undefined) {
    if (!data.dueAt || Number.isNaN(new Date(data.dueAt).getTime())) {
      const err = new Error('Date & time is required');
      err.status = 400;
      throw err;
    }
  }
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) {
    const err = new Error(`priority must be one of ${PRIORITIES.join(', ')}`);
    err.status = 400;
    throw err;
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    const err = new Error(`status must be one of ${STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }
}
export const fileRepo = {
  kind: 'file',
  async list({ search, status, from, to } = {}) {
    let tasks = read();
    if (search) {
      const q = String(search).toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }
    if (status) tasks = tasks.filter((t) => t.status === status);
    if (from) tasks = tasks.filter((t) => new Date(t.dueAt) >= new Date(from));
    if (to) tasks = tasks.filter((t) => new Date(t.dueAt) <= new Date(to));
    return tasks.sort(
      (a, b) =>
        new Date(a.dueAt) - new Date(b.dueAt) ||
        new Date(a.createdAt) - new Date(b.createdAt)
    );
  },

  async get(id) {
    return read().find((t) => t.id === id) || null;
  },
  async create(data) {
    validate(data);
    const now = new Date().toISOString();
    const task = {
      id: crypto.randomUUID(),
      title: String(data.title).trim(),
      description: (data.description ?? '').trim(),
      dueAt: iso(data.dueAt),
      endAt: iso(data.endAt),
      priority: data.priority ?? 'medium',
      status: data.status ?? 'open',
      completedAt: iso(data.completedAt),
      createdAt: now,
      updatedAt: now,
    };
    const tasks = read();
    tasks.push(task);
    write(tasks);
    return task;
  },
  async update(id, data) {
    validate(data, { partial: true });
    const tasks = read();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const next = { ...tasks[index] };
    for (const key of ['title', 'description', 'priority', 'status']) {
      if (data[key] !== undefined) next[key] = data[key];
    }
    for (const key of ['dueAt', 'endAt', 'completedAt']) {
      if (data[key] !== undefined) next[key] = iso(data[key]);
    }
    next.updatedAt = new Date().toISOString();
    tasks[index] = next;
    write(tasks);
    return next;
  },
  async remove(id) {
    const tasks = read();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const [removed] = tasks.splice(index, 1);
    write(tasks);
    return removed;
  },
};
