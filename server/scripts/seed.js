const API_URL = (process.env.API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const at = (dayOffset, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};
const TASKS = [
  { title: 'Finishing Wireframe', description: 'Wrap up the mobile wireframe for the to-do app.', dueAt: at(0, 9), endAt: at(0, 11), priority: 'high' },
  { title: 'Meeting with team', description: 'Weekly sync: sprint scope and blockers.', dueAt: at(0, 13), endAt: at(0, 14), priority: 'medium' },
  { title: 'Buy a cat food', description: 'Two bags of the salmon one.', dueAt: at(0, 18), priority: 'low', status: 'completed' },
  { title: 'Finishing daily commission', description: '', dueAt: at(0, 20), priority: 'medium', status: 'completed' },
  { title: 'Review pull requests', description: 'Go through the open PRs on the API repo.', dueAt: at(1, 10), priority: 'high', status: 'in_progress' },
  { title: 'Doing Homework', description: 'Maths exercises, chapter 4.', dueAt: at(2, 16), endAt: at(2, 18), priority: 'medium' },
  { title: 'Plan next sprint', description: 'Draft the backlog for next week.', dueAt: at(7, 11), priority: 'medium' },
  { title: 'Dentist appointment', description: 'Clinic on 5th street.', dueAt: at(-3, 15), priority: 'high', status: 'completed' },
];
const run = async () => {
  let created = 0;
  for (const task of TASKS) {
    const { status, ...body } = task;
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await res.json();
    if (!res.ok) {
      console.error(`x ${task.title}: ${payload.error}`);
      continue;
    }
    if (status && status !== 'open') {
      await fetch(`${API_URL}/tasks/${payload.data.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    }
    created += 1;
    console.log(`+ ${task.title}`);
  }
  console.log(`\nSeeded ${created} tasks into ${API_URL}`);
};
run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
