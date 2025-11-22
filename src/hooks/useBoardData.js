import { useReducer, useEffect, useCallback } from 'react';
import { loadBoardData, saveBoardData } from '../utils/storage';
import { generateId } from '../utils/idGenerator';

// Action types
const ADD_COLUMN = 'ADD_COLUMN';
const UPDATE_COLUMN = 'UPDATE_COLUMN';
const DELETE_COLUMN = 'DELETE_COLUMN';
const ADD_CARD = 'ADD_CARD';
const UPDATE_CARD = 'UPDATE_CARD';
const DELETE_CARD = 'DELETE_CARD';
const REORDER_CARDS = 'REORDER_CARDS';
const MOVE_CARD = 'MOVE_CARD';
const REORDER_COLUMNS = 'REORDER_COLUMNS';
const UPDATE_BOARD_TITLE = 'UPDATE_BOARD_TITLE';

// Reducer function
function boardReducer(state, action) {
  switch (action.type) {
    case UPDATE_BOARD_TITLE:
      return {
        ...state,
        board: {
          ...state.board,
          title: action.payload.title || 'Untitled Board',
        },
      };

    case ADD_COLUMN: {
      const newColumnId = generateId();
      const newColumn = {
        id: newColumnId,
        title: action.payload.title || 'Untitled Column',
        cardIds: [],
      };

      return {
        ...state,
        board: {
          ...state.board,
          columnOrder: [...state.board.columnOrder, newColumnId],
        },
        columns: {
          ...state.columns,
          [newColumnId]: newColumn,
        },
      };
    }

    case UPDATE_COLUMN: {
      const { columnId, title } = action.payload;
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            title: title || 'Untitled Column',
          },
        },
      };
    }

    case DELETE_COLUMN: {
      const { columnId } = action.payload;
      const column = state.columns[columnId];

      if (!column) return state;

      // Remove column
      const newColumns = { ...state.columns };
      delete newColumns[columnId];

      // Remove all cards in the column
      const newCards = { ...state.cards };
      column.cardIds.forEach((cardId) => {
        delete newCards[cardId];
      });

      // Remove column from order
      const newColumnOrder = state.board.columnOrder.filter(
        (id) => id !== columnId
      );

      return {
        ...state,
        board: {
          ...state.board,
          columnOrder: newColumnOrder,
        },
        columns: newColumns,
        cards: newCards,
      };
    }

    case ADD_CARD: {
      const { columnId, title, description } = action.payload;
      const newCardId = generateId();
      const newCard = {
        id: newCardId,
        title,
        description: description || '',
        createdAt: Date.now(),
      };

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cardIds: [...state.columns[columnId].cardIds, newCardId],
          },
        },
        cards: {
          ...state.cards,
          [newCardId]: newCard,
        },
      };
    }

    case UPDATE_CARD: {
      const { cardId, title, description } = action.payload;
      return {
        ...state,
        cards: {
          ...state.cards,
          [cardId]: {
            ...state.cards[cardId],
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
          },
        },
      };
    }

    case DELETE_CARD: {
      const { cardId, columnId } = action.payload;

      // Remove card from cards
      const newCards = { ...state.cards };
      delete newCards[cardId];

      // Remove card from column
      const newColumns = { ...state.columns };
      newColumns[columnId] = {
        ...newColumns[columnId],
        cardIds: newColumns[columnId].cardIds.filter((id) => id !== cardId),
      };

      return {
        ...state,
        columns: newColumns,
        cards: newCards,
      };
    }

    case REORDER_CARDS: {
      const { columnId, cardIds } = action.payload;
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cardIds,
          },
        },
      };
    }

    case MOVE_CARD: {
      const { cardId, sourceColumnId, destColumnId, destIndex } = action.payload;

      const sourceColumn = state.columns[sourceColumnId];
      const destColumn = state.columns[destColumnId];

      // Remove card from source
      const newSourceCardIds = sourceColumn.cardIds.filter((id) => id !== cardId);

      // Add card to destination
      const newDestCardIds = [...destColumn.cardIds];
      newDestCardIds.splice(destIndex, 0, cardId);

      return {
        ...state,
        columns: {
          ...state.columns,
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
    }

    case REORDER_COLUMNS: {
      const { columnOrder } = action.payload;
      return {
        ...state,
        board: {
          ...state.board,
          columnOrder,
        },
      };
    }

    default:
      return state;
  }
}

/**
 * Custom hook for managing board state
 */
export function useBoardData() {
  const [state, dispatch] = useReducer(boardReducer, null, loadBoardData);

  // Save to localStorage whenever state changes (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveBoardData(state);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Action creators
  const updateBoardTitle = useCallback((title) => {
    dispatch({ type: UPDATE_BOARD_TITLE, payload: { title } });
  }, []);

  const addColumn = useCallback((title) => {
    dispatch({ type: ADD_COLUMN, payload: { title } });
  }, []);

  const updateColumn = useCallback((columnId, title) => {
    dispatch({ type: UPDATE_COLUMN, payload: { columnId, title } });
  }, []);

  const deleteColumn = useCallback((columnId) => {
    dispatch({ type: DELETE_COLUMN, payload: { columnId } });
  }, []);

  const addCard = useCallback((columnId, title, description = '') => {
    dispatch({ type: ADD_CARD, payload: { columnId, title, description } });
  }, []);

  const updateCard = useCallback((cardId, updates) => {
    dispatch({ type: UPDATE_CARD, payload: { cardId, ...updates } });
  }, []);

  const deleteCard = useCallback((cardId, columnId) => {
    dispatch({ type: DELETE_CARD, payload: { cardId, columnId } });
  }, []);

  const reorderCards = useCallback((columnId, cardIds) => {
    dispatch({ type: REORDER_CARDS, payload: { columnId, cardIds } });
  }, []);

  const moveCard = useCallback((cardId, sourceColumnId, destColumnId, destIndex) => {
    dispatch({
      type: MOVE_CARD,
      payload: { cardId, sourceColumnId, destColumnId, destIndex },
    });
  }, []);

  const reorderColumns = useCallback((columnOrder) => {
    dispatch({ type: REORDER_COLUMNS, payload: { columnOrder } });
  }, []);

  return {
    state,
    actions: {
      updateBoardTitle,
      addColumn,
      updateColumn,
      deleteColumn,
      addCard,
      updateCard,
      deleteCard,
      reorderCards,
      moveCard,
      reorderColumns,
    },
  };
}
