import React, { useState, useEffect } from 'react';
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
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Column } from './components/Column';
import { AddCardForm } from './components/AddCardForm';
import { Card as CardType, BoardState } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import './App.css';

const initialBoardState: BoardState = {
  todo: [],
  inProgress: [],
  done: [],
};

const columnConfig = [
  { id: 'todo' as const, title: 'To Do' },
  { id: 'inProgress' as const, title: 'In Progress' },
  { id: 'done' as const, title: 'Done' },
];

function App() {
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [lastSelectedCard, setLastSelectedCard] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      setBoardState(savedState);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(boardState);
  }, [boardState]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addCard = (columnId: 'todo' | 'inProgress' | 'done', title: string, description: string) => {
    const newCard: CardType = {
      id: generateId(),
      title,
      description,
      column: columnId,
    };

    setBoardState(prev => ({
      ...prev,
      [columnId]: [...prev[columnId], newCard],
    }));
  };

  const updateCard = (cardId: string, title: string, description: string) => {
    setBoardState(prev => {
      const newState = { ...prev };
      for (const columnId in newState) {
        const column = columnId as keyof BoardState;
        const cardIndex = newState[column].findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          newState[column] = [...newState[column]];
          newState[column][cardIndex] = { ...newState[column][cardIndex], title, description };
          break;
        }
      }
      return newState;
    });
  };

  const deleteCard = (cardId: string) => {
    console.log('deleteCard called with ID:', cardId);
    setBoardState(prev => {
      const newState = { ...prev };
      console.log('Previous state:', prev);
      for (const columnId in newState) {
        const column = columnId as keyof BoardState;
        const beforeCount = newState[column].length;
        newState[column] = newState[column].filter(card => card.id !== cardId);
        const afterCount = newState[column].length;
        console.log(`Column ${columnId}: ${beforeCount} -> ${afterCount} cards`);
      }
      console.log('New state:', newState);
      return newState;
    });
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const handleCardSelect = (cardId: string, isShiftClick: boolean) => {
    if (isShiftClick && lastSelectedCard) {
      // Handle range selection
      const allCards = [
        ...boardState.todo,
        ...boardState.inProgress,
        ...boardState.done,
      ];
      
      const lastSelectedIndex = allCards.findIndex(card => card.id === lastSelectedCard);
      const currentIndex = allCards.findIndex(card => card.id === cardId);
      
      if (lastSelectedIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeCards = allCards.slice(start, end + 1);
        
        setSelectedCards(prev => {
          const newSet = new Set(prev);
          rangeCards.forEach(card => {
            if (prev.has(card.id)) {
              newSet.delete(card.id);
            } else {
              newSet.add(card.id);
            }
          });
          return newSet;
        });
      }
    } else {
      // Handle single selection
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
      setLastSelectedCard(cardId);
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const allCards = [...boardState.todo, ...boardState.inProgress, ...boardState.done];
    const card = allCards.find(c => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find which column the active card belongs to
    let sourceColumn: keyof BoardState | null = null;

    for (const columnId in boardState) {
      const column = columnId as keyof BoardState;
      const index = boardState[column].findIndex(card => card.id === activeId);
      if (index !== -1) {
        sourceColumn = column;
        break;
      }
    }

    if (!sourceColumn) return;

    // Handle multi-card drag
    const cardsToMove = selectedCards.has(activeId) 
      ? Array.from(selectedCards)
      : [activeId];

    // Find target column and position
    let targetColumn: keyof BoardState | null = null;
    let targetIndex = -1;

    // Check if dropping on a column
    if (columnConfig.some(col => col.id === overId)) {
      targetColumn = overId as keyof BoardState;
      targetIndex = boardState[targetColumn].length;
    } else {
      // Check if dropping on a card
      for (const columnId in boardState) {
        const column = columnId as keyof BoardState;
        const index = boardState[column].findIndex(card => card.id === overId);
        if (index !== -1) {
          targetColumn = column;
          targetIndex = index;
          break;
        }
      }
    }

    if (!targetColumn) return;

    // If dropping in the same column at the same position, do nothing
    if (sourceColumn === targetColumn && cardsToMove.length === 1) {
      const cardIndex = boardState[sourceColumn].findIndex(card => card.id === activeId);
      if (cardIndex === targetIndex) return;
    }

    // Move cards
    setBoardState(prev => {
      const newState = { ...prev };
      
      // Remove cards from source columns
      cardsToMove.forEach(cardId => {
        for (const columnId in newState) {
          const column = columnId as keyof BoardState;
          newState[column] = newState[column].filter(card => card.id !== cardId);
        }
      });

      // Add cards to target column in correct order
      const cardsToAdd: CardType[] = [];
      cardsToMove.forEach(cardId => {
        const allCards = [...prev.todo, ...prev.inProgress, ...prev.done];
        const card = allCards.find(c => c.id === cardId);
        if (card) {
          cardsToAdd.push({ ...card, column: targetColumn as 'todo' | 'inProgress' | 'done' });
        }
      });

      const targetColumnState = targetColumn as keyof BoardState;
      
      if (targetIndex === -1 || targetIndex === newState[targetColumnState].length) {
        newState[targetColumnState] = [...newState[targetColumnState], ...cardsToAdd];
      } else {
        const beforeCards = newState[targetColumnState].slice(0, targetIndex);
        const afterCards = newState[targetColumnState].slice(targetIndex);
        newState[targetColumnState] = [...beforeCards, ...cardsToAdd, ...afterCards];
      }

      return newState;
    });

    // Clear selection after move
    setSelectedCards(new Set());
    setLastSelectedCard(null);
  };

  return (
    <div className="App">
      <h1>Kanban Board</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {columnConfig.map(column => (
            <div key={column.id} className="column-wrapper">
              <Column
                column={{
                  id: column.id,
                  title: column.title,
                  cards: boardState[column.id],
                }}
                selectedCards={selectedCards}
                onCardSelect={handleCardSelect}
                onCardUpdate={updateCard}
                onCardDelete={deleteCard}
              />
              <AddCardForm onAddCard={(title, description) => addCard(column.id, title, description)} />
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="card dragging">
              <h3 className="card-title">{activeCard.title}</h3>
              <p className="card-description">{activeCard.description}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
