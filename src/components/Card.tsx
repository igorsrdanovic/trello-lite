import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType } from '../types';

interface Props {
  card: CardType;
  onClick: () => void;
  isSelected: boolean;
  onToggleSelect: (e: React.MouseEvent) => void;
}

const priorityColors = {
  high: 'border-l-4 border-red-500',
  medium: 'border-l-4 border-yellow-500',
  low: 'border-l-4 border-green-500',
};

const priorityBadges = {
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  medium:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
};

function Card({ card, onClick, isSelected, onToggleSelect }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasDescription = card.description && card.description.trim().length > 0;
  const hasDueDate = card.dueDate;
  const isOverdue = hasDueDate && card.dueDate! < Date.now();

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow ${
        card.priority ? priorityColors[card.priority] : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <div className="text-sm text-gray-900 dark:text-white line-clamp-2 mb-2">
            {card.title}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {card.priority && (
              <span
                className={`text-xs px-2 py-0.5 rounded ${priorityBadges[card.priority]}`}
              >
                {card.priority.toUpperCase()}
              </span>
            )}

            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {hasDueDate && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{new Date(card.dueDate!).toLocaleDateString()}</span>
              </div>
            )}

            {hasDescription && (
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            )}
          </div>
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(e as any);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </motion.div>
  );
}

export default memo(Card);
