export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addWeeks(date, amount) {
  return addDays(date, amount * 7);
}

export function isSameDay(a, b) {
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function weekDays(date) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function toDateInput(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function toTimeInput(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function toISO(dateValue, timeValue) {
  if (!dateValue) return null;
  const [y, m, d] = dateValue.split('-').map(Number);
  const [hh, mm] = (timeValue || '00:00').split(':').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

export const formatDateLong = (date) => {
  const d = new Date(date);
  const weekday = d.toLocaleDateString(undefined, { weekday: 'long' });
  const month = d.toLocaleDateString(undefined, { month: 'long' });
  return `${weekday} ${d.getDate()}, ${month}`;
};

export const formatDayShort = (date) =>
  new Date(date).toLocaleDateString(undefined, { weekday: 'short' });

export const formatMonthDay = (date) =>
  new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export function formatWeekRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const day = (d) => String(d.getDate()).padStart(2, '0');
  const month = (d) => d.toLocaleDateString(undefined, { month: 'short' });

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${day(s)} - ${day(e)} ${month(s)} ${e.getFullYear()}`;
  }
  return `${day(s)} ${month(s)} - ${day(e)} ${month(e)} ${e.getFullYear()}`;
}

export function weekLabel(start) {
  const thisWeek = startOfWeek(new Date()).getTime();
  const target = startOfWeek(start).getTime();
  const diff = Math.round((target - thisWeek) / (7 * 24 * 60 * 60 * 1000));

  if (diff === 0) return 'This Week';
  if (diff === 1) return 'Next Week';
  if (diff === -1) return 'Last Week';
  if (diff > 1) return `In ${diff} weeks`;
  return `${Math.abs(diff)} weeks ago`;
}
