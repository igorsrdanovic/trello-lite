import type { AppState, BoardsState } from '../types';

const STORAGE_KEY = 'trello-lite-data';
const BOARDS_STORAGE_KEY = 'trello-lite-boards';
const THEME_KEY = 'trello-lite-theme';

/**
 * Get default board state
 */
export function getDefaultBoardState(): AppState {
  const col1Id = 'col-1';
  const col2Id = 'col-2';
  const col3Id = 'col-3';

  return {
    board: {
      id: 'board-1',
      title: 'My Board',
      columnOrder: [col1Id, col2Id, col3Id],
    },
    columns: {
      [col1Id]: {
        id: col1Id,
        title: 'To Do',
        cardIds: [],
      },
      [col2Id]: {
        id: col2Id,
        title: 'In Progress',
        cardIds: [],
      },
      [col3Id]: {
        id: col3Id,
        title: 'Done',
        cardIds: [],
      },
    },
    cards: {},
  };
}

/**
 * Get default boards state
 */
export function getDefaultBoardsState(): BoardsState {
  const defaultBoard = getDefaultBoardState();
  return {
    boards: {
      [defaultBoard.board.id]: defaultBoard,
    },
    activeBoard: defaultBoard.board.id,
  };
}

/**
 * Load board data from localStorage
 * Returns default state if data is corrupted or doesn't exist
 */
export function loadBoardData(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return getDefaultBoardState();
    }

    const parsed = JSON.parse(data);

    // Validate structure
    if (!parsed.board || !parsed.columns || !parsed.cards) {
      console.warn('Invalid board data structure, using default');
      return getDefaultBoardState();
    }

    return parsed;
  } catch (error) {
    console.error('Error loading board data:', error);
    return getDefaultBoardState();
  }
}

/**
 * Load all boards data from localStorage
 */
export function loadBoardsData(): BoardsState {
  try {
    const data = localStorage.getItem(BOARDS_STORAGE_KEY);
    if (!data) {
      return getDefaultBoardsState();
    }

    const parsed = JSON.parse(data);

    // Validate structure
    if (!parsed.boards || !parsed.activeBoard) {
      console.warn('Invalid boards data structure, using default');
      return getDefaultBoardsState();
    }

    return parsed;
  } catch (error) {
    console.error('Error loading boards data:', error);
    return getDefaultBoardsState();
  }
}

/**
 * Save board data to localStorage
 */
export function saveBoardData(data: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving board data:', error);

    // Check if quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Cannot save changes.');
    }

    return false;
  }
}

/**
 * Save all boards data to localStorage
 */
export function saveBoardsData(data: BoardsState): boolean {
  try {
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving boards data:', error);

    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Cannot save changes.');
    }

    return false;
  }
}

/**
 * Clear all board data (for testing/reset)
 */
export function clearBoardData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BOARDS_STORAGE_KEY);
}

/**
 * Export board data as JSON
 */
export function exportBoardData(data: AppState): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Import board data from JSON
 */
export function importBoardData(jsonString: string): AppState {
  try {
    const parsed = JSON.parse(jsonString);

    // Validate structure
    if (!parsed.board || !parsed.columns || !parsed.cards) {
      throw new Error('Invalid board data structure');
    }

    return parsed;
  } catch (error) {
    console.error('Error importing board data:', error);
    throw new Error('Failed to import board data. Invalid JSON format.');
  }
}

/**
 * Get theme from localStorage
 */
export function getTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): {
  used: number;
  total: number;
  percentage: number;
} {
  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Most browsers have a 5-10MB limit
    const total = 5 * 1024 * 1024; // Assume 5MB
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  } catch {
    return { used: 0, total: 0, percentage: 0 };
  }
}
