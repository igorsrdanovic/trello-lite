import { describe, it, expect } from 'vitest';
import {
  getDefaultBoardState,
  exportBoardData,
  importBoardData,
} from '../storage';

describe('storage utilities', () => {
  describe('getDefaultBoardState', () => {
    it('should return a valid default board state', () => {
      const state = getDefaultBoardState();

      expect(state.board).toBeDefined();
      expect(state.columns).toBeDefined();
      expect(state.cards).toBeDefined();
      expect(state.board.columnOrder).toHaveLength(3);
    });

    it('should have default columns', () => {
      const state = getDefaultBoardState();
      const columnTitles = Object.values(state.columns).map((col) => col.title);

      expect(columnTitles).toContain('To Do');
      expect(columnTitles).toContain('In Progress');
      expect(columnTitles).toContain('Done');
    });
  });

  describe('exportBoardData', () => {
    it('should export board data as JSON string', () => {
      const state = getDefaultBoardState();
      const exported = exportBoardData(state);

      expect(typeof exported).toBe('string');
      expect(() => JSON.parse(exported)).not.toThrow();
    });
  });

  describe('importBoardData', () => {
    it('should import valid board data', () => {
      const state = getDefaultBoardState();
      const exported = exportBoardData(state);
      const imported = importBoardData(exported);

      expect(imported).toEqual(state);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => importBoardData('invalid json')).toThrow();
    });

    it('should throw error for invalid structure', () => {
      expect(() => importBoardData('{}')).toThrow();
    });
  });
});
