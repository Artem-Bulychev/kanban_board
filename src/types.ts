export interface Card {
  id: string;
  title: string;
  description: string;
  column: 'todo' | 'inProgress' | 'done';
}

export interface Column {
  id: 'todo' | 'inProgress' | 'done';
  title: string;
  cards: Card[];
}

export type BoardState = {
  todo: Card[];
  inProgress: Card[];
  done: Card[];
};
