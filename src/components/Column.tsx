import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from './Card';
import { Card as CardType, Column as ColumnType } from '../types';

interface ColumnProps {
  column: ColumnType;
  selectedCards: Set<string>;
  onCardSelect: (cardId: string, isShiftClick: boolean) => void;
  onCardUpdate: (cardId: string, title: string, description: string) => void;
  onCardDelete: (cardId: string) => void;
  onCardsReorder: (columnId: 'todo' | 'inProgress' | 'done', cards: CardType[]) => void;
  onCardsMove: (cardIds: string[], targetColumnId: string, targetIndex?: number) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  selectedCards,
  onCardSelect,
  onCardUpdate,
  onCardDelete,
  onCardsReorder,
  onCardsMove,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeCard = column.cards.find(card => card.id === active.id);
    if (!activeCard) return;

    const overCard = column.cards.find(card => card.id === over.id);
    
    if (active.id === over.id) return;

    // Handle reordering within the same column
    if (overCard) {
      const oldIndex = column.cards.findIndex(card => card.id === active.id);
      const newIndex = column.cards.findIndex(card => card.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove(column.cards, oldIndex, newIndex);
        onCardsReorder(column.id, newCards);
      }
    }
  };

  return (
    <div className="column">
      <h2 className="column-title">{column.title}</h2>
      <div className="column-cards">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={column.cards.map(card => card.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                isSelected={selectedCards.has(card.id)}
                onSelect={onCardSelect}
                onUpdate={onCardUpdate}
                onDelete={onCardDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
