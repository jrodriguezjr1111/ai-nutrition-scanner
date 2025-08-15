import { MMKV } from 'react-native-mmkv';
import { LogEntry, AppSettings } from '@/stores/types';

// Initialize MMKV storage
export const storage = new MMKV();

// Storage keys
const STORAGE_KEYS = {
  LOG_ENTRIES: 'log_entries',
  SETTINGS: 'app_settings',
  LAST_SYNC: 'last_sync',
} as const;

// Log entries storage
export const logStorage = {
  save: (entries: LogEntry[]) => {
    try {
      storage.set(STORAGE_KEYS.LOG_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save log entries:', error);
    }
  },

  load: (): LogEntry[] => {
    try {
      const data = storage.getString(STORAGE_KEYS.LOG_ENTRIES);
      if (!data) return [];
      
      const entries = JSON.parse(data);
      // Convert timestamp strings back to Date objects
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load log entries:', error);
      return [];
    }
  },

  clear: () => {
    try {
      storage.delete(STORAGE_KEYS.LOG_ENTRIES);
    } catch (error) {
      console.error('Failed to clear log entries:', error);
    }
  },
};

// Settings storage
export const settingsStorage = {
  save: (settings: AppSettings) => {
    try {
      storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  load: (): AppSettings | null => {
    try {
      const data = storage.getString(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  },

  clear: () => {
    try {
      storage.delete(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  },
};

// General storage utilities
export const storageUtils = {
  setLastSync: (timestamp: Date) => {
    try {
      storage.set(STORAGE_KEYS.LAST_SYNC, timestamp.toISOString());
    } catch (error) {
      console.error('Failed to set last sync:', error);
    }
  },

  getLastSync: (): Date | null => {
    try {
      const data = storage.getString(STORAGE_KEYS.LAST_SYNC);
      return data ? new Date(data) : null;
    } catch (error) {
      console.error('Failed to get last sync:', error);
      return null;
    }
  },

  clearAll: () => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Failed to clear all storage:', error);
    }
  },

  getStorageSize: () => {
    try {
      // Get approximate storage size by checking all keys
      const keys = storage.getAllKeys();
      let totalSize = 0;
      
      keys.forEach(key => {
        const value = storage.getString(key);
        if (value) {
          totalSize += value.length;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  },
};
