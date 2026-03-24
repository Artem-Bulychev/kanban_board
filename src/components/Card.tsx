import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onSelect: (cardId: string, isShiftClick: boolean) => void;
  onUpdate: (cardId: string, title: string, description: string) => void;
  onDelete: (cardId: string) => void;
  isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isDragging = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: card.id,
    disabled: isEditing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('card-content')) {
      onSelect(card.id, e.shiftKey);
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
      setEditTitle(card.title);
      setEditDescription(card.description);
    }
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(card.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(card.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isSelected ? 'selected' : ''} ${isSortableDragging ? 'dragging' : ''}`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <div className="card-content">
        {isEditing ? (
          <div className="card-edit" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="card-title-input"
              placeholder="Card title"
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="card-description-input"
              placeholder="Card description"
              rows={3}
            />
            <div className="card-edit-actions">
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="card-title" onClick={handleTitleClick}>
              {card.title}
            </h3>
            <p className="card-description">{card.description}</p>
            <button 
              onClick={handleDelete} 
              className="delete-btn"
              onMouseDown={(e) => e.stopPropagation()}
            >
              ×
            </button>
          </>
        )}
      </div>
    </div>
  );
};
