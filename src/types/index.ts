export interface Card {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: number;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columnOrder: string[];
}

export interface AppState {
  board: Board;
  columns: { [columnId: string]: Column };
  cards: { [cardId: string]: Card };
}

export interface BoardsState {
  boards: { [boardId: string]: AppState };
  activeBoard: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
}

export interface SearchFilters {
  searchTerm: string;
  tags: string[];
  priority: Priority | null;
}
