import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['N'], description: 'Add new card to first column' },
  { keys: ['C'], description: 'Add new column' },
  { keys: ['/'], description: 'Focus search' },
  { keys: ['D'], description: 'Toggle dark mode' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
  { keys: ['Ctrl', 'E'], description: 'Export board' },
  { keys: ['Ctrl', 'K'], description: 'Clear filters' },
  { keys: ['Esc'], description: 'Close modals / Clear selection' },
  { keys: ['Enter'], description: 'Save when editing' },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid gap-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {shortcut.description}
              </span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
