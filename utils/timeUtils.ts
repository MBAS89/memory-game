import { format } from 'date-fns';

/** Get today's date in YYYY-MM-DD format */
export const getTodayString = (): string => format(new Date(), 'yyyy-MM-dd');

/** Check if stored date is today (string compare avoids TZ pitfalls here) */
export const isToday = (dateStr: string): boolean => dateStr === getTodayString();

/** Milliseconds until next midnight */
export const getTimeUntilReset = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return Math.max(0, tomorrow.getTime() - now.getTime());
};

/** Format milliseconds into HH:MM:SS */
export const formatTime = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
