import { create } from 'zustand';
import { getTheme, saveTheme } from '../utils/storage';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getTheme(),

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      saveTheme(newTheme);
      return { theme: newTheme };
    });
  },

  setTheme: (theme) => {
    saveTheme(theme);
    set({ theme });
  },
}));
