// Chat message display component with citation support
import React from 'react';
import { ChatMessage, Citation } from './types';
import clsx from 'clsx';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Function to render citations
  const renderCitations = () => {
    if (!message.citations || message.citations.length === 0) {
      return null;
    }

    return (
      <div className="citations">
        <h4 className="citations-title">Sources:</h4>
        <ul className="citations-list">
          {message.citations.map((citation, index) => (
            <li key={index} className="citation-item">
              {citation.chapter && <span className="citation-chapter">{citation.chapter}</span>}
              {citation.section && <span className="citation-section">{citation.section}</span>}
              {citation.url && (
                <a 
                  href={citation.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="citation-link"
                >
                  View Source
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={clsx('chat-message', { 'user-message': isUser, 'assistant-message': !isUser })}>
      <div className="message-content">
        {message.content}
      </div>
      {message.citations && renderCitations()}
    </div>
  );
};

export default ChatMessageComponent;