import mongoose from 'mongoose';

export const PRIORITIES = ['low', 'medium', 'high'];
export const STATUSES = ['open', 'in_progress', 'completed'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [140, 'Title cannot be longer than 140 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot be longer than 2000 characters'],
    },
    dueAt: {
      type: Date,
      required: [true, 'Date & time is required'],
    },
    endAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'medium',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'open',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ dueAt: 1 });

export const Task = mongoose.model('Task', taskSchema);
