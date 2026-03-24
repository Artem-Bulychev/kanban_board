import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from './Card';
import { Column as ColumnType } from '../types';

interface ColumnProps {
  column: ColumnType;
  selectedCards: Set<string>;
  onCardSelect: (cardId: string, isShiftClick: boolean) => void;
  onCardUpdate: (cardId: string, title: string, description: string) => void;
  onCardDelete: (cardId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  selectedCards,
  onCardSelect,
  onCardUpdate,
  onCardDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className={`column ${isOver ? 'drag-over' : ''}`}>
      <h2 className="column-title">{column.title}</h2>
      <div className="column-cards" ref={setNodeRef}>
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
      </div>
    </div>
  );
};
