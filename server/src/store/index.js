import mongoose from 'mongoose';
import { mongoRepo } from './mongoRepo.js';
import { fileRepo } from './fileRepo.js';

let repo = mongoRepo;

export const getRepo = () => repo;

export async function connectStore() {
  const uri = process.env.MONGODB_URI;
  const allowFallback = process.env.ALLOW_FILE_FALLBACK !== 'false';
  if (!uri) {
    if (!allowFallback) throw new Error('MONGODB_URI is not set');
    repo = fileRepo;
    console.warn('[store] MONGODB_URI not set - using local file store (development only)');
    return repo;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    repo = mongoRepo;
    console.log('[store] connected to MongoDB');
  } catch (err) {
    if (!allowFallback) throw err;
    repo = fileRepo;
    console.warn(`[store] MongoDB unavailable (${err.message}) - using local file store (development only)`);
  }
  return repo;
}
