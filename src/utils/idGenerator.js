/**
 * Generate a unique ID for entities
 * Uses crypto.randomUUID() if available, fallback to timestamp-based ID
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
