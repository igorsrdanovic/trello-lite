import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import Column from './Column';
import AddColumnButton from './AddColumnButton';
import CardModal from './CardModal';
import ConfirmDialog from './ConfirmDialog';

export default function Board({ boardState, actions }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState(boardState.board.title);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const titleInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleBoardTitleSave = () => {
    const trimmedTitle = boardTitle.trim();
    if (trimmedTitle && trimmedTitle !== boardState.board.title) {
      actions.updateBoardTitle(trimmedTitle);
    } else {
      setBoardTitle(boardState.board.title);
    }
    setIsEditingTitle(false);
  };

  const handleBoardTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBoardTitleSave();
    } else if (e.key === 'Escape') {
      setBoardTitle(boardState.board.title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteColumn = (columnId, cardCount) => {
    if (cardCount > 0) {
      setDeleteConfirm({
        type: 'column',
        columnId,
        message: `Delete column and all ${cardCount} card${cardCount !== 1 ? 's' : ''}?`,
      });
    } else {
      actions.deleteColumn(columnId);
    }
  };

  const handleCardSave = (updates) => {
    if (selectedCard) {
      actions.updateCard(selectedCard.id, updates);
    }
  };

  const handleCardDelete = () => {
    if (selectedCard) {
      // Find which column contains this card
      const columnId = Object.keys(boardState.columns).find((colId) =>
        boardState.columns[colId].cardIds.includes(selectedCard.id)
      );
      if (columnId) {
        actions.deleteCard(selectedCard.id, columnId);
      }
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're dragging a card
    const activeCard = boardState.cards[activeId];
    if (activeCard) {
      // Find source and destination columns
      let sourceColumnId = null;
      let destColumnId = null;

      for (const colId of boardState.board.columnOrder) {
        const column = boardState.columns[colId];
        if (column.cardIds.includes(activeId)) {
          sourceColumnId = colId;
        }
        if (column.cardIds.includes(overId)) {
          destColumnId = colId;
        }
        // Check if we're dropping over a column
        if (colId === overId) {
          destColumnId = colId;
        }
      }

      if (!sourceColumnId) return;

      // If no destination column found, use source column
      if (!destColumnId) {
        destColumnId = sourceColumnId;
      }

      if (sourceColumnId === destColumnId) {
        // Reordering within the same column
        const column = boardState.columns[sourceColumnId];
        const oldIndex = column.cardIds.indexOf(activeId);
        const newIndex = column.cardIds.indexOf(overId);

        if (oldIndex !== newIndex) {
          const newCardIds = arrayMove(column.cardIds, oldIndex, newIndex);
          actions.reorderCards(sourceColumnId, newCardIds);
        }
      } else {
        // Moving to a different column
        const destColumn = boardState.columns[destColumnId];
        let newIndex = destColumn.cardIds.indexOf(overId);

        // If dropping over the column itself (not a card), add to end
        if (newIndex === -1) {
          newIndex = destColumn.cardIds.length;
        }

        actions.moveCard(activeId, sourceColumnId, destColumnId, newIndex);
      }
    }
  };

  // Get the active card being dragged for the drag overlay
  const activeCard = activeId ? boardState.cards[activeId] : null;

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            onBlur={handleBoardTitleSave}
            onKeyDown={handleBoardTitleKeyDown}
            className="text-2xl font-bold px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-block"
          >
            {boardState.board.title}
          </h1>
        )}
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            {boardState.board.columnOrder.map((columnId) => {
              const column = boardState.columns[columnId];
              const cards = column.cardIds.map((cardId) => boardState.cards[cardId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  cards={cards}
                  onUpdateTitle={actions.updateColumn}
                  onDelete={handleDeleteColumn}
                  onAddCard={actions.addCard}
                  onCardClick={setSelectedCard}
                />
              );
            })}

            <AddColumnButton onAdd={actions.addColumn} />
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="bg-white border border-gray-300 rounded p-3 shadow-lg opacity-90 w-[268px]">
                <div className="text-sm text-gray-900 line-clamp-2">
                  {activeCard.title}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onSave={handleCardSave}
          onDelete={handleCardDelete}
        />
      )}

      {/* Confirm Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          message={deleteConfirm.message}
          onConfirm={() => {
            if (deleteConfirm.type === 'column') {
              actions.deleteColumn(deleteConfirm.columnId);
            }
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
