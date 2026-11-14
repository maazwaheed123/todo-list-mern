import { Router } from 'express';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  updateStatus,
  deleteTask,
  weeklySummary,
} from '../controllers/taskController.js';

const router = Router();

router.get('/summary/weeks', weeklySummary);

router.route('/').get(listTasks).post(createTask);

router.patch('/:id/status', updateStatus);

router.route('/:id').get(getTask).patch(updateTask).put(updateTask).delete(deleteTask);

export default router;
