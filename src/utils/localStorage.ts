import { BoardState } from '../types';

const STORAGE_KEY = 'kanban-board';

export const saveToLocalStorage = (state: BoardState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): BoardState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};
