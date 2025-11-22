import { useState, useRef, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import Column from './Column';
import AddColumnButton from './AddColumnButton';
import CardModal from './CardModal';
import ConfirmDialog from './ConfirmDialog';
import SearchBar from './SearchBar';
import BoardSwitcher from './BoardSwitcher';
import EmptyState from './EmptyState';

import { useBoardStore } from '../store/useBoardStore';
import type { Card as CardType } from '../types';

export default function Board() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'column';
    columnId: string;
    message: string;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Store selectors
  const currentBoard = useBoardStore((state) => state.getCurrentBoard());
  const searchTerm = useBoardStore((state) => state.searchTerm);
  const selectedPriority = useBoardStore((state) => state.selectedPriority);
  const selectedCards = useBoardStore((state) => state.selectedCards);
  const canUndo = useBoardStore((state) => state.canUndo());
  const canRedo = useBoardStore((state) => state.canRedo());

  // Actions
  const updateBoardTitle = useBoardStore((state) => state.updateBoardTitle);
  const addColumn = useBoardStore((state) => state.addColumn);
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const addCard = useBoardStore((state) => state.addCard);
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const reorderCards = useBoardStore((state) => state.reorderCards);
  const moveCard = useBoardStore((state) => state.moveCard);
  const duplicateCard = useBoardStore((state) => state.duplicateCard);
  const toggleCardSelection = useBoardStore(
    (state) => state.toggleCardSelection
  );
  const clearSelection = useBoardStore((state) => state.clearSelection);
  const bulkDeleteCards = useBoardStore((state) => state.bulkDeleteCards);
  const undo = useBoardStore((state) => state.undo);
  const redo = useBoardStore((state) => state.redo);
  const exportBoard = useBoardStore((state) => state.exportBoard);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    setBoardTitle(currentBoard.board.title);
  }, [currentBoard.board.title]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleBoardTitleSave = () => {
    const trimmedTitle = boardTitle.trim();
    if (trimmedTitle && trimmedTitle !== currentBoard.board.title) {
      updateBoardTitle(trimmedTitle);
      toast.success('Board title updated');
    } else {
      setBoardTitle(currentBoard.board.title);
    }
    setIsEditingTitle(false);
  };

  const handleBoardTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBoardTitleSave();
    } else if (e.key === 'Escape') {
      setBoardTitle(currentBoard.board.title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteColumn = (columnId: string, cardCount: number) => {
    if (cardCount > 0) {
      setDeleteConfirm({
        type: 'column',
        columnId,
        message: `Delete column and all ${cardCount} card${cardCount !== 1 ? 's' : ''}?`,
      });
    } else {
      deleteColumn(columnId);
      toast.success('Column deleted');
    }
  };

  const handleCardSave = (updates: Partial<CardType>) => {
    if (selectedCard) {
      updateCard(selectedCard.id, updates);
      setSelectedCard({ ...selectedCard, ...updates });
    }
  };

  const handleCardDelete = () => {
    if (selectedCard) {
      const columnId = Object.keys(currentBoard.columns).find((colId) =>
        currentBoard.columns[colId].cardIds.includes(selectedCard.id)
      );
      if (columnId) {
        deleteCard(selectedCard.id, columnId);
        toast.success('Card deleted');
      }
    }
  };

  const handleCardDuplicate = () => {
    if (selectedCard) {
      const columnId = Object.keys(currentBoard.columns).find((colId) =>
        currentBoard.columns[colId].cardIds.includes(selectedCard.id)
      );
      if (columnId) {
        duplicateCard(selectedCard.id, columnId);
        toast.success('Card duplicated');
      }
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeCard = currentBoard.cards[activeId];
    if (activeCard) {
      let sourceColumnId: string | null = null;
      let destColumnId: string | null = null;

      for (const colId of currentBoard.board.columnOrder) {
        const column = currentBoard.columns[colId];
        if (column.cardIds.includes(activeId)) {
          sourceColumnId = colId;
        }
        if (column.cardIds.includes(overId)) {
          destColumnId = colId;
        }
        if (colId === overId) {
          destColumnId = colId;
        }
      }

      if (!sourceColumnId) return;

      if (!destColumnId) {
        destColumnId = sourceColumnId;
      }

      if (sourceColumnId === destColumnId) {
        const column = currentBoard.columns[sourceColumnId];
        const oldIndex = column.cardIds.indexOf(activeId);
        const newIndex = column.cardIds.indexOf(overId);

        if (oldIndex !== newIndex) {
          const newCardIds = arrayMove(column.cardIds, oldIndex, newIndex);
          reorderCards(sourceColumnId, newCardIds);
        }
      } else {
        const destColumn = currentBoard.columns[destColumnId];
        let newIndex = destColumn.cardIds.indexOf(overId);

        if (newIndex === -1) {
          newIndex = destColumn.cardIds.length;
        }

        moveCard(activeId, sourceColumnId, destColumnId, newIndex);
        toast.success('Card moved');
      }
    }
  };

  const handleExport = () => {
    const data = exportBoard();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBoard.board.title.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Board exported');
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      toast.success('Undo');
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
      toast.success('Redo');
    }
  };

  // Filter cards based on search and filters
  const filteredColumns = useMemo(() => {
    if (!searchTerm && !selectedPriority) {
      return currentBoard.board.columnOrder.map((columnId) => {
        const column = currentBoard.columns[columnId];
        const cards = column.cardIds.map((cardId) => currentBoard.cards[cardId]);
        return { column, cards };
      });
    }

    return currentBoard.board.columnOrder.map((columnId) => {
      const column = currentBoard.columns[columnId];
      const cards = column.cardIds
        .map((cardId) => currentBoard.cards[cardId])
        .filter((card) => {
          const matchesSearch =
            !searchTerm ||
            card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.description.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesPriority =
            !selectedPriority || card.priority === selectedPriority;

          return matchesSearch && matchesPriority;
        });
      return { column, cards };
    });
  }, [currentBoard, searchTerm, selectedPriority]);

  const activeCard = activeId ? currentBoard.cards[activeId] : null;

  const hasColumns = currentBoard.board.columnOrder.length > 0;

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors">
      {/* Board Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <BoardSwitcher />
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onBlur={handleBoardTitleSave}
                onKeyDown={handleBoardTitleKeyDown}
                className="text-2xl font-bold px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded inline-block"
              >
                {currentBoard.board.title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedCards.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <span className="text-sm text-blue-700 dark:text-blue-400">
                  {selectedCards.size} selected
                </span>
                <button
                  onClick={bulkDeleteCards}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
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
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>

            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Shift+Z)"
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
                  d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                />
              </svg>
            </button>

            <button
              onClick={handleExport}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Export board (Ctrl+E)"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        </div>

        <SearchBar />
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-5">
        {!hasColumns ? (
          <EmptyState
            title="No columns yet"
            description="Create your first column to start organizing tasks"
            action={{
              label: 'Add Column',
              onClick: () => addColumn('To Do'),
            }}
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full">
              <AnimatePresence>
                {filteredColumns.map(({ column, cards }) => (
                  <Column
                    key={column.id}
                    column={column}
                    cards={cards}
                    onUpdateTitle={updateColumn}
                    onDelete={handleDeleteColumn}
                    onAddCard={addCard}
                    onCardClick={setSelectedCard}
                    selectedCards={selectedCards}
                    onToggleCardSelection={toggleCardSelection}
                  />
                ))}
              </AnimatePresence>

              <AddColumnButton onAdd={addColumn} />
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-3 shadow-lg opacity-90 w-[268px]">
                  <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                    {activeCard.title}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onSave={handleCardSave}
          onDelete={handleCardDelete}
          onDuplicate={handleCardDuplicate}
        />
      )}

      {/* Confirm Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          message={deleteConfirm.message}
          onConfirm={() => {
            if (deleteConfirm.type === 'column') {
              deleteColumn(deleteConfirm.columnId);
              toast.success('Column deleted');
            }
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
