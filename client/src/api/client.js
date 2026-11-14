const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the API running?');
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }
  return payload;
}

const query = (params) => {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const tasksApi = {
  list: (params) => request(`/tasks${query(params)}`).then((r) => r.data),
  get: (id) => request(`/tasks/${id}`).then((r) => r.data),
  create: (body) => request('/tasks', { method: 'POST', body }).then((r) => r.data),
  update: (id, body) => request(`/tasks/${id}`, { method: 'PATCH', body }).then((r) => r.data),
  setStatus: (id, status) =>
    request(`/tasks/${id}/status`, { method: 'PATCH', body: { status } }).then((r) => r.data),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }).then((r) => r.data),
  weeklySummary: () => request('/tasks/summary/weeks').then((r) => r.data),
  health: () => request('/health'),
};
