import { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import Board from './components/Board';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { useBoardStore } from './store/useBoardStore';
import { useThemeStore } from './store/useThemeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { importBoardData } from './utils/storage';

function App() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const addColumn = useBoardStore((state) => state.addColumn);
  const addCard = useBoardStore((state) => state.addCard);
  const getCurrentBoard = useBoardStore((state) => state.getCurrentBoard);
  const exportBoard = useBoardStore((state) => state.exportBoard);
  const importBoard = useBoardStore((state) => state.importBoard);
  const undo = useBoardStore((state) => state.undo);
  const redo = useBoardStore((state) => state.redo);
  const canUndo = useBoardStore((state) => state.canUndo());
  const canRedo = useBoardStore((state) => state.canRedo());
  const clearFilters = useBoardStore((state) => state.clearFilters);
  const clearSelection = useBoardStore((state) => state.clearSelection);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '?',
      action: () => setShowShortcuts(true),
      preventDefault: true,
    },
    {
      key: 'd',
      action: () => {
        toggleTheme();
        toast.success(
          `Switched to ${theme === 'light' ? 'dark' : 'light'} mode`
        );
      },
      preventDefault: true,
    },
    {
      key: 'c',
      action: () => {
        addColumn('New Column');
        toast.success('Column added');
      },
      preventDefault: true,
    },
    {
      key: 'n',
      action: () => {
        const board = getCurrentBoard();
        if (board.board.columnOrder.length > 0) {
          const firstColumnId = board.board.columnOrder[0];
          addCard(firstColumnId, 'New Card');
          toast.success('Card added');
        }
      },
      preventDefault: true,
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        if (canRedo) {
          redo();
          toast.success('Redo');
        }
      },
      preventDefault: true,
    },
    {
      key: 'z',
      ctrlKey: true,
      action: (e) => {
        if (!e.shiftKey && canUndo) {
          undo();
          toast.success('Undo');
        }
      },
      preventDefault: true,
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => {
        const data = exportBoard();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const board = getCurrentBoard();
        a.download = `${board.board.title.replace(/\s+/g, '-')}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Board exported');
      },
      preventDefault: true,
    },
    {
      key: 'i',
      ctrlKey: true,
      action: () => {
        fileInputRef.current?.click();
      },
      preventDefault: true,
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        clearFilters();
        toast.success('Filters cleared');
      },
      preventDefault: true,
    },
    {
      key: 'Escape',
      action: () => {
        clearSelection();
      },
    },
  ]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const data = importBoardData(jsonString);
        importBoard(data);
        toast.success('Board imported successfully');
      } catch (error) {
        toast.error('Failed to import board. Invalid file format.');
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Board />

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 z-40"
          title="Toggle theme (D)"
        >
          {theme === 'light' ? (
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>

        {/* Help Button */}
        <button
          onClick={() => setShowShortcuts(true)}
          className="fixed bottom-6 right-24 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 z-40"
          title="Show shortcuts (?)"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />

        {/* Toast Notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
