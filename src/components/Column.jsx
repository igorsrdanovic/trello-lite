import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';

export default function Column({
  column,
  cards,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onCardClick,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const titleInputRef = useRef(null);
  const cardInputRef = useRef(null);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isAddingCard) {
      cardInputRef.current?.focus();
    }
  }, [isAddingCard]);

  const handleTitleSave = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle !== column.title) {
      onUpdateTitle(column.id, trimmedTitle);
    } else {
      setTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditingTitle(false);
    }
  };

  const handleAddCard = () => {
    const trimmedTitle = cardTitle.trim();
    if (trimmedTitle) {
      onAddCard(column.id, trimmedTitle);
      setCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    } else if (e.key === 'Escape') {
      setCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleDeleteClick = () => {
    onDelete(column.id, cards.length);
  };

  return (
    <div className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
      {/* Column Header */}
      <div className="h-[60px] px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="flex-1 px-2 py-1 text-base font-semibold border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h3
            onClick={() => setIsEditingTitle(true)}
            className="flex-1 text-base font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
          >
            {column.title}
          </h3>
        )}
        <button
          onClick={handleDeleteClick}
          className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Delete column"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Cards Area */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-4">
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {/* Add Card Form */}
        {isAddingCard ? (
          <div className="mt-2">
            <textarea
              ref={cardInputRef}
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              onKeyDown={handleCardKeyDown}
              placeholder="Enter card title (Shift+Enter for newline)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleAddCard}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Add
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setCardTitle('');
                  setIsAddingCard(false);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full mt-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Card</span>
          </button>
        )}
      </div>
    </div>
  );
}
