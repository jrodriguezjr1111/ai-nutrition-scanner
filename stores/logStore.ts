import { create } from 'zustand';
import { LogEntry, LogState, Product } from './types';
import { logStorage } from '@/utils/storage';

interface LogStore extends LogState {
  // Actions
  addEntry: (product: Product) => void;
  removeEntry: (entryId: string) => void;
  setSelectedDate: (date: 'today' | 'week' | 'month') => void;
  getTotalCalories: (date?: 'today' | 'week' | 'month') => number;
  getAverageHealthScore: (date?: 'today' | 'week' | 'month') => number;
  getEntriesForDate: (date: 'today' | 'week' | 'month') => LogEntry[];
  clearAllEntries: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const isWithinDateRange = (timestamp: Date, range: 'today' | 'week' | 'month'): boolean => {
  const now = new Date();
  const entryDate = new Date(timestamp);
  
  switch (range) {
    case 'today':
      return entryDate.toDateString() === now.toDateString();
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo && entryDate <= now;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return entryDate >= monthAgo && entryDate <= now;
    default:
      return false;
  }
};

export const useLogStore = create<LogStore>((set, get) => ({
  // Initial state
  entries: logStorage.load(),
  selectedDate: 'today',

  // Actions
  addEntry: (product) => {
    const newEntry: LogEntry = {
      id: generateId(),
      productId: product.id,
      product,
      timestamp: new Date(),
      servingSize: product.servingSize,
      calories: product.calories,
      healthScore: product.healthScore,
    };
    
    set((state) => {
      const newEntries = [newEntry, ...state.entries];
      logStorage.save(newEntries);
      return { entries: newEntries };
    });
  },

  removeEntry: (entryId) => {
    set((state) => {
      const newEntries = state.entries.filter(entry => entry.id !== entryId);
      logStorage.save(newEntries);
      return { entries: newEntries };
    });
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  getTotalCalories: (date) => {
    const { entries, selectedDate } = get();
    const targetDate = date || selectedDate;
    const filteredEntries = entries.filter(entry => 
      isWithinDateRange(entry.timestamp, targetDate)
    );
    return filteredEntries.reduce((total, entry) => total + entry.calories, 0);
  },

  getAverageHealthScore: (date) => {
    const { entries, selectedDate } = get();
    const targetDate = date || selectedDate;
    const filteredEntries = entries.filter(entry => 
      isWithinDateRange(entry.timestamp, targetDate)
    );
    
    if (filteredEntries.length === 0) return 0;
    
    const total = filteredEntries.reduce((sum, entry) => sum + entry.healthScore, 0);
    return Number((total / filteredEntries.length).toFixed(1));
  },

  getEntriesForDate: (date) => {
    const { entries } = get();
    return entries.filter(entry => isWithinDateRange(entry.timestamp, date));
  },

  clearAllEntries: () => {
    logStorage.clear();
    set({ entries: [] });
  },
}));
