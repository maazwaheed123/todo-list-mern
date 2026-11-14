import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import { connectStore, getRepo } from './store/index.js';

const app = express();
const PORT = process.env.PORT || 4000;
const origins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: getRepo().kind, time: new Date().toISOString() });
});

app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err?.name === 'ValidationError') {
    const message = Object.values(err.errors ?? {})
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ error: message || 'Validation failed' });
  }
  if (err?.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for "${err.path}"` });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message || 'Internal server error' });
});

connectStore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  });
