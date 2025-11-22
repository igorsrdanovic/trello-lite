const STORAGE_KEY = 'trello-lite-data';

/**
 * Get default board state
 */
export function getDefaultBoardState() {
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
 * Load board data from localStorage
 * Returns default state if data is corrupted or doesn't exist
 */
export function loadBoardData() {
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
 * Save board data to localStorage
 */
export function saveBoardData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving board data:', error);

    // Check if quota exceeded
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Cannot save changes.');
    }

    return false;
  }
}

/**
 * Clear all board data (for testing/reset)
 */
export function clearBoardData() {
  localStorage.removeItem(STORAGE_KEY);
}
