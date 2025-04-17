const STORAGE_KEY = 'timers';

export const saveTimers = (timers) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Error saving timers to localStorage:', error);
  }
};

export const loadTimers = () => {
  try {
    const timers = localStorage.getItem(STORAGE_KEY);
    return timers ? JSON.parse(timers) : [];
  } catch (error) {
    console.error('Error loading timers from localStorage:', error);
    return [];
  }
};
