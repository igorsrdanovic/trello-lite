import { useState, useRef, useEffect } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function BoardSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const boards = useBoardStore((state) => state.boards);
  const activeBoard = useBoardStore((state) => state.activeBoard);
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);
  const createBoard = useBoardStore((state) => state.createBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeBoardData = boards[activeBoard];
  const boardList = Object.values(boards);

  useEffect(() => {
    if (isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      boardList.length > 1 &&
      confirm('Are you sure you want to delete this board?')
    ) {
      deleteBoard(boardId);
    } else if (boardList.length === 1) {
      alert('Cannot delete the last board');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <span className="font-medium">{activeBoardData?.board.title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-2 max-h-96 overflow-y-auto">
              {boardList.map((board) => (
                <div
                  key={board.board.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    board.board.id === activeBoard
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setActiveBoard(board.board.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{board.board.title}</span>
                  {boardList.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteBoard(board.board.id, e)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete board"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                {isCreating ? (
                  <div className="px-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateBoard();
                        if (e.key === 'Escape') setIsCreating(false);
                      }}
                      placeholder="Board name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleCreateBoard}
                        className="flex-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setIsCreating(false)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Create new board</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
