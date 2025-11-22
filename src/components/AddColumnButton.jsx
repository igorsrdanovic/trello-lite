import { useState, useRef, useEffect } from 'react';

export default function AddColumnButton({ onAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <div className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm p-4">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="Enter column title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
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
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="flex-shrink-0 w-[300px] h-fit bg-white bg-opacity-60 hover:bg-opacity-80 rounded-lg p-4 transition-all flex items-center gap-2 text-gray-700 hover:text-gray-900"
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
    </button>
  );
}
