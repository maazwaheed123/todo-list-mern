import { Task } from '../models/Task.js';

const serialize = (doc) => {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    title: o.title,
    description: o.description ?? '',
    dueAt: o.dueAt ? new Date(o.dueAt).toISOString() : null,
    endAt: o.endAt ? new Date(o.endAt).toISOString() : null,
    priority: o.priority,
    status: o.status,
    completedAt: o.completedAt ? new Date(o.completedAt).toISOString() : null,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
    updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : null,
  };
};

const buildQuery = ({ search, status, from, to }) => {
  const query = {};

  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: rx }, { description: rx }];
  }

  if (status) query.status = status;

  if (from || to) {
    query.dueAt = {};
    if (from) query.dueAt.$gte = new Date(from);
    if (to) query.dueAt.$lte = new Date(to);
  }

  return query;
};

export const mongoRepo = {
  kind: 'mongodb',

  async list(filters = {}) {
    const docs = await Task.find(buildQuery(filters)).sort({ dueAt: 1, createdAt: 1 });
    return docs.map(serialize);
  },

  async get(id) {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    return serialize(await Task.findById(id));
  },

  async create(data) {
    return serialize(await Task.create(data));
  },

  async update(id, data) {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    const doc = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return serialize(doc);
  },

  async remove(id) {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    return serialize(await Task.findByIdAndDelete(id));
  },
};
