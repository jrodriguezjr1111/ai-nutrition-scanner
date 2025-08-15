import { create } from 'zustand';
import { AppSettings } from './types';
import { settingsStorage } from '@/utils/storage';

interface SettingsStore extends AppSettings {
  // Actions
  setDailyCalorieGoal: (goal: number) => void;
  setHealthScoreThreshold: (threshold: number) => void;
  setNotifications: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaultSettings: AppSettings = {
  dailyCalorieGoal: 2000,
  healthScoreThreshold: 7.0,
  notifications: true,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // Initial state
  ...(settingsStorage.load() || defaultSettings),

  // Actions
  setDailyCalorieGoal: (goal) => {
    set({ dailyCalorieGoal: goal });
    settingsStorage.save(get());
  },
  
  setHealthScoreThreshold: (threshold) => {
    set({ healthScoreThreshold: threshold });
    settingsStorage.save(get());
  },
  
  setNotifications: (enabled) => {
    set({ notifications: enabled });
    settingsStorage.save(get());
  },
  
  resetToDefaults: () => {
    set(defaultSettings);
    settingsStorage.save(defaultSettings);
  },
}));
