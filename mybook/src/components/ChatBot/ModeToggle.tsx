// Mode toggle component for switching between BOOK and SELECTION modes
import React from 'react';
import { useChat } from './context';
import { ModeType } from './types';
import clsx from 'clsx';

const ModeToggle: React.FC = () => {
  const { mode, dispatch } = useChat();

  const handleModeChange = (newMode: ModeType) => {
    dispatch({ type: 'SET_MODE', payload: newMode });
  };

  return (
    <div className="mode-toggle">
      <div className="mode-buttons">
        <button
          className={clsx('mode-button', { active: mode === 'BOOK' })}
          onClick={() => handleModeChange('BOOK')}
        >
          <span className="mode-label">BOOK MODE</span>
          <div className="mode-description">Search entire book content</div>
        </button>
        <button
          className={clsx('mode-button', { active: mode === 'SELECTION' })}
          onClick={() => handleModeChange('SELECTION')}
        >
          <span className="mode-label">SELECTION MODE</span>
          <div className="mode-description">Answer from selected text only</div>
        </button>
      </div>
      {mode === 'SELECTION' && (
        <div className="selection-info">
          <p>Selected text: {useChat().selectedText?.substring(0, 60)}{useChat().selectedText && useChat().selectedText.length > 60 ? '...' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default ModeToggle;