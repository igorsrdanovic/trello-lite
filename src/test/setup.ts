import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  // Cleanup DOM
  document.body.innerHTML = '';
});
