import { create } from 'zustand';
import type { AppState, Card, Priority } from '../types';
import { loadBoardsData, saveBoardsData } from '../utils/storage';
import { generateId } from '../utils/idGenerator';

interface BoardState {
  boards: { [boardId: string]: AppState };
  activeBoard: string;
  history: AppState[];
  historyIndex: number;
  searchTerm: string;
  selectedTags: string[];
  selectedPriority: Priority | null;
  selectedCards: Set<string>;

  // Board operations
  setActiveBoard: (boardId: string) => void;
  createBoard: (title: string) => void;
  deleteBoard: (boardId: string) => void;
  updateBoardTitle: (title: string) => void;

  // Column operations
  addColumn: (title: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (columnOrder: string[]) => void;

  // Card operations
  addCard: (columnId: string, title: string, description?: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  reorderCards: (columnId: string, cardIds: string[]) => void;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    destColumnId: string,
    destIndex: number
  ) => void;
  duplicateCard: (cardId: string, columnId: string) => void;

  // Bulk operations
  toggleCardSelection: (cardId: string) => void;
  clearSelection: () => void;
  bulkMoveCards: (targetColumnId: string) => void;
  bulkDeleteCards: () => void;

  // Search & Filter
  setSearchTerm: (term: string) => void;
  toggleTagFilter: (tag: string) => void;
  setPriorityFilter: (priority: Priority | null) => void;
  clearFilters: () => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Export/Import
  exportBoard: () => string;
  importBoard: (data: AppState) => void;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;

  // Get current board
  getCurrentBoard: () => AppState;
}

export const useBoardStore = create<BoardState>((set, get) => {
  const initialData = loadBoardsData();

  const addToHistory = (newState: AppState) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newState)));

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
    } else {
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
    }
  };

  const updateBoard = (updater: (board: AppState) => AppState) => {
    const { boards, activeBoard } = get();
    const currentBoard = boards[activeBoard];
    const newBoard = updater(currentBoard);

    addToHistory(newBoard);

    const newBoards = {
      ...boards,
      [activeBoard]: newBoard,
    };

    set({ boards: newBoards });

    // Save to storage
    setTimeout(() => {
      saveBoardsData({ boards: newBoards, activeBoard });
    }, 300);
  };

  return {
    boards: initialData.boards,
    activeBoard: initialData.activeBoard,
    history: [initialData.boards[initialData.activeBoard]],
    historyIndex: 0,
    searchTerm: '',
    selectedTags: [],
    selectedPriority: null,
    selectedCards: new Set(),

    getCurrentBoard: () => {
      const { boards, activeBoard } = get();
      return boards[activeBoard];
    },

    setActiveBoard: (boardId) => {
      set({ activeBoard: boardId });
    },

    createBoard: (title) => {
      const newBoardId = generateId();
      const newBoard: AppState = {
        board: {
          id: newBoardId,
          title,
          columnOrder: [],
        },
        columns: {},
        cards: {},
      };

      const { boards } = get();
      const newBoards = {
        ...boards,
        [newBoardId]: newBoard,
      };

      set({ boards: newBoards, activeBoard: newBoardId });
      saveBoardsData({ boards: newBoards, activeBoard: newBoardId });
    },

    deleteBoard: (boardId) => {
      const { boards, activeBoard } = get();
      const newBoards = { ...boards };
      delete newBoards[boardId];

      const boardIds = Object.keys(newBoards);
      const newActiveBoard =
        boardId === activeBoard && boardIds.length > 0
          ? boardIds[0]
          : activeBoard;

      set({ boards: newBoards, activeBoard: newActiveBoard });
      saveBoardsData({ boards: newBoards, activeBoard: newActiveBoard });
    },

    updateBoardTitle: (title) => {
      updateBoard((board) => ({
        ...board,
        board: {
          ...board.board,
          title: title || 'Untitled Board',
        },
      }));
    },

    addColumn: (title) => {
      updateBoard((board) => {
        const newColumnId = generateId();
        const newColumn = {
          id: newColumnId,
          title: title || 'Untitled Column',
          cardIds: [],
        };

        return {
          ...board,
          board: {
            ...board.board,
            columnOrder: [...board.board.columnOrder, newColumnId],
          },
          columns: {
            ...board.columns,
            [newColumnId]: newColumn,
          },
        };
      });
    },

    updateColumn: (columnId, title) => {
      updateBoard((board) => ({
        ...board,
        columns: {
          ...board.columns,
          [columnId]: {
            ...board.columns[columnId],
            title: title || 'Untitled Column',
          },
        },
      }));
    },

    deleteColumn: (columnId) => {
      updateBoard((board) => {
        const column = board.columns[columnId];
        if (!column) return board;

        const newColumns = { ...board.columns };
        delete newColumns[columnId];

        const newCards = { ...board.cards };
        column.cardIds.forEach((cardId) => {
          delete newCards[cardId];
        });

        const newColumnOrder = board.board.columnOrder.filter(
          (id) => id !== columnId
        );

        return {
          ...board,
          board: {
            ...board.board,
            columnOrder: newColumnOrder,
          },
          columns: newColumns,
          cards: newCards,
        };
      });
    },

    reorderColumns: (columnOrder) => {
      updateBoard((board) => ({
        ...board,
        board: {
          ...board.board,
          columnOrder,
        },
      }));
    },

    addCard: (columnId, title, description = '') => {
      updateBoard((board) => {
        const newCardId = generateId();
        const newCard: Card = {
          id: newCardId,
          title,
          description,
          createdAt: Date.now(),
        };

        return {
          ...board,
          columns: {
            ...board.columns,
            [columnId]: {
              ...board.columns[columnId],
              cardIds: [...board.columns[columnId].cardIds, newCardId],
            },
          },
          cards: {
            ...board.cards,
            [newCardId]: newCard,
          },
        };
      });
    },

    updateCard: (cardId, updates) => {
      updateBoard((board) => ({
        ...board,
        cards: {
          ...board.cards,
          [cardId]: {
            ...board.cards[cardId],
            ...updates,
          },
        },
      }));
    },

    deleteCard: (cardId, columnId) => {
      updateBoard((board) => {
        const newCards = { ...board.cards };
        delete newCards[cardId];

        const newColumns = { ...board.columns };
        newColumns[columnId] = {
          ...newColumns[columnId],
          cardIds: newColumns[columnId].cardIds.filter((id) => id !== cardId),
        };

        return {
          ...board,
          columns: newColumns,
          cards: newCards,
        };
      });
    },

    reorderCards: (columnId, cardIds) => {
      updateBoard((board) => ({
        ...board,
        columns: {
          ...board.columns,
          [columnId]: {
            ...board.columns[columnId],
            cardIds,
          },
        },
      }));
    },

    moveCard: (cardId, sourceColumnId, destColumnId, destIndex) => {
      updateBoard((board) => {
        const sourceColumn = board.columns[sourceColumnId];
        const destColumn = board.columns[destColumnId];

        const newSourceCardIds = sourceColumn.cardIds.filter(
          (id) => id !== cardId
        );
        const newDestCardIds = [...destColumn.cardIds];
        newDestCardIds.splice(destIndex, 0, cardId);

        return {
          ...board,
          columns: {
            ...board.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              cardIds: newSourceCardIds,
            },
            [destColumnId]: {
              ...destColumn,
              cardIds: newDestCardIds,
            },
          },
        };
      });
    },

    duplicateCard: (cardId, columnId) => {
      updateBoard((board) => {
        const originalCard = board.cards[cardId];
        const newCardId = generateId();
        const newCard: Card = {
          ...originalCard,
          id: newCardId,
          title: `${originalCard.title} (Copy)`,
          createdAt: Date.now(),
        };

        const column = board.columns[columnId];
        const cardIndex = column.cardIds.indexOf(cardId);

        const newCardIds = [...column.cardIds];
        newCardIds.splice(cardIndex + 1, 0, newCardId);

        return {
          ...board,
          columns: {
            ...board.columns,
            [columnId]: {
              ...column,
              cardIds: newCardIds,
            },
          },
          cards: {
            ...board.cards,
            [newCardId]: newCard,
          },
        };
      });
    },

    toggleCardSelection: (cardId) => {
      const { selectedCards } = get();
      const newSelection = new Set(selectedCards);

      if (newSelection.has(cardId)) {
        newSelection.delete(cardId);
      } else {
        newSelection.add(cardId);
      }

      set({ selectedCards: newSelection });
    },

    clearSelection: () => {
      set({ selectedCards: new Set() });
    },

    bulkMoveCards: (targetColumnId) => {
      const { selectedCards } = get();

      updateBoard((board) => {
        let newBoard = { ...board };

        selectedCards.forEach((cardId) => {
          // Find source column
          const sourceColumnId = Object.keys(newBoard.columns).find((colId) =>
            newBoard.columns[colId].cardIds.includes(cardId)
          );

          if (sourceColumnId && sourceColumnId !== targetColumnId) {
            // Remove from source
            const sourceColumn = newBoard.columns[sourceColumnId];
            const newSourceCardIds = sourceColumn.cardIds.filter(
              (id) => id !== cardId
            );

            // Add to target
            const targetColumn = newBoard.columns[targetColumnId];
            const newTargetCardIds = [...targetColumn.cardIds, cardId];

            newBoard = {
              ...newBoard,
              columns: {
                ...newBoard.columns,
                [sourceColumnId]: {
                  ...sourceColumn,
                  cardIds: newSourceCardIds,
                },
                [targetColumnId]: {
                  ...targetColumn,
                  cardIds: newTargetCardIds,
                },
              },
            };
          }
        });

        return newBoard;
      });

      set({ selectedCards: new Set() });
    },

    bulkDeleteCards: () => {
      const { selectedCards } = get();

      updateBoard((board) => {
        const newCards = { ...board.cards };
        const newColumns = { ...board.columns };

        selectedCards.forEach((cardId) => {
          delete newCards[cardId];

          // Remove from all columns
          Object.keys(newColumns).forEach((colId) => {
            newColumns[colId] = {
              ...newColumns[colId],
              cardIds: newColumns[colId].cardIds.filter((id) => id !== cardId),
            };
          });
        });

        return {
          ...board,
          columns: newColumns,
          cards: newCards,
        };
      });

      set({ selectedCards: new Set() });
    },

    setSearchTerm: (term) => {
      set({ searchTerm: term });
    },

    toggleTagFilter: (tag) => {
      const { selectedTags } = get();
      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      set({ selectedTags: newTags });
    },

    setPriorityFilter: (priority) => {
      set({ selectedPriority: priority });
    },

    clearFilters: () => {
      set({ searchTerm: '', selectedTags: [], selectedPriority: null });
    },

    undo: () => {
      const { history, historyIndex, boards, activeBoard } = get();

      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const previousState = history[newIndex];

        const newBoards = {
          ...boards,
          [activeBoard]: previousState,
        };

        set({ boards: newBoards, historyIndex: newIndex });
        saveBoardsData({ boards: newBoards, activeBoard });
      }
    },

    redo: () => {
      const { history, historyIndex, boards, activeBoard } = get();

      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];

        const newBoards = {
          ...boards,
          [activeBoard]: nextState,
        };

        set({ boards: newBoards, historyIndex: newIndex });
        saveBoardsData({ boards: newBoards, activeBoard });
      }
    },

    canUndo: () => {
      const { historyIndex } = get();
      return historyIndex > 0;
    },

    canRedo: () => {
      const { history, historyIndex } = get();
      return historyIndex < history.length - 1;
    },

    exportBoard: () => {
      const { boards, activeBoard } = get();
      return JSON.stringify(boards[activeBoard], null, 2);
    },

    importBoard: (data) => {
      const newBoardId = generateId();
      const importedBoard = {
        ...data,
        board: {
          ...data.board,
          id: newBoardId,
        },
      };

      const { boards } = get();
      const newBoards = {
        ...boards,
        [newBoardId]: importedBoard,
      };

      set({ boards: newBoards, activeBoard: newBoardId });
      saveBoardsData({ boards: newBoards, activeBoard: newBoardId });
    },

    saveToStorage: () => {
      const { boards, activeBoard } = get();
      saveBoardsData({ boards, activeBoard });
    },

    loadFromStorage: () => {
      const data = loadBoardsData();
      set({
        boards: data.boards,
        activeBoard: data.activeBoard,
        history: [data.boards[data.activeBoard]],
        historyIndex: 0,
      });
    },
  };
});
