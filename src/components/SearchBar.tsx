import { useRef, useEffect } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import type { Priority } from '../types';

interface Props {
  onFocus?: () => void;
}

export default function SearchBar({ onFocus }: Props) {
  const searchTerm = useBoardStore((state) => state.searchTerm);
  const selectedPriority = useBoardStore((state) => state.selectedPriority);
  const setSearchTerm = useBoardStore((state) => state.setSearchTerm);
  const setPriorityFilter = useBoardStore((state) => state.setPriorityFilter);
  const clearFilters = useBoardStore((state) => state.clearFilters);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlashKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          inputRef.current?.focus();
          onFocus?.();
        }
      }
    };

    document.addEventListener('keydown', handleSlashKey);
    return () => document.removeEventListener('keydown', handleSlashKey);
  }, [onFocus]);

  const hasFilters = searchTerm || selectedPriority;

  return (
    <div className="flex items-center gap-2 flex-1 max-w-2xl">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cards... (press / to focus)"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <select
        value={selectedPriority || ''}
        onChange={(e) =>
          setPriorityFilter(
            e.target.value ? (e.target.value as Priority) : null
          )
        }
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          title="Clear filters (Ctrl+K)"
        >
          Clear
        </button>
      )}
    </div>
  );
}
