import React, { useState } from 'react';

interface AddCardFormProps {
  onAddCard: (title: string, description: string) => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ onAddCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddCard(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button className="add-card-btn" onClick={() => setIsExpanded(true)}>
        + Add Card
      </button>
    );
  }

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        className="add-card-title"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Card description"
        className="add-card-description"
        rows={3}
      />
      <div className="add-card-actions">
        <button type="submit" className="add-card-submit">
          Add Card
        </button>
        <button type="button" onClick={handleCancel} className="add-card-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
};
