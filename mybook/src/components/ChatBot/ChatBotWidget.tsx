// Chat widget that can be embedded in Docusaurus pages
import React, { useState } from 'react';
import { ChatProvider } from './context';
import ChatBotContainer from './ChatBotContainer';
import clsx from 'clsx';

interface ChatBotWidgetProps {
  initialMode?: 'BOOK' | 'SELECTION';
  embedded?: boolean; // Whether this is embedded in a page or standalone
}

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ 
  initialMode = 'BOOK', 
  embedded = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (embedded && !isOpen) {
    return (
      <button className="chat-widget-toggle" onClick={toggleChat}>
        <span>🤖 Ask AI</span>
      </button>
    );
  }

  return (
    <ChatProvider>
      <div className={clsx('chat-widget', { 'chat-widget-expanded': embedded })}>
        {embedded && (
          <div className="chat-widget-header">
            <h3>AI Textbook Assistant</h3>
            <button className="chat-widget-close" onClick={toggleChat}>
              ×
            </button>
          </div>
        )}
        <ChatBotContainer />
      </div>
    </ChatProvider>
  );
};

export default ChatBotWidget;