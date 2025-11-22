import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddColumnButton({ onAdd }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-shrink-0 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="Enter column title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
        />
        <div className="flex gap-2">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleAdd}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Add
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCancel}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsAdding(true)}
      className="flex-shrink-0 w-[300px] h-fit bg-white dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 hover:bg-opacity-80 dark:hover:bg-opacity-80 rounded-lg p-4 transition-all flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm"
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
      <span className="font-medium">Add Column</span>
    </motion.button>
  );
}
