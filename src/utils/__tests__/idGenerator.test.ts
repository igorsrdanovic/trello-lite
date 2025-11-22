import { describe, it, expect } from 'vitest';
import { generateId } from '../idGenerator';

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('should generate a string ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('should generate IDs with reasonable length', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(10);
  });
});
