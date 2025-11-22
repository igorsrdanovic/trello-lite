import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for syncing state with localStorage
 * Includes debouncing to batch rapid changes
 */
export function useLocalStorage(key, initialValue, debounceMs = 300) {
  // Lazy initialization
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the save operation
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        if (error.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Cannot save changes.');
        }
      }
    }, debounceMs);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, value, debounceMs]);

  return [value, setValue];
}
