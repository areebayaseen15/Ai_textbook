// Main chatbot container component
import React, { useState, KeyboardEvent } from 'react';
import { useChat } from './context';
import TextSelectionHandler from './TextSelectionHandler';
import ModeToggle from './ModeToggle';
import ChatMessageComponent from './ChatMessage';
import FallbackComponent from './FallbackComponent';
import clsx from 'clsx';
import './styles.css';

const ChatBotContainer: React.FC = () => {
  const {
    messages,
    currentInput,
    isLoading,
    error,
    mode,
    selectedText,
    dispatch,
    sendMessage
  } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      await sendMessage(currentInput);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'UPDATE_CURRENT_INPUT', payload: e.target.value });
  };

  // Check if the service is completely unavailable
  if (error && error.includes('Failed to fetch') && messages.length === 0) {
    return (
      <div className="chatbot-container">
        <div className="chat-header">
          <h3>AI Textbook Assistant</h3>
        </div>
        <FallbackComponent
          error={error}
          onRetry={() => {
            // Try to reconnect by sending a test message
            sendMessage("test connection");
          }}
        />
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <TextSelectionHandler
        onTextSelected={(text) => dispatch({ type: 'SET_SELECTED_TEXT', payload: text })}
      />

      <div className="chat-header">
        <h3>AI Textbook Assistant</h3>
        <ModeToggle />
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {error && !error.includes('Failed to fetch') && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === 'SELECTION' && selectedText
              ? 'Ask about the selected text...'
              : 'Ask a question about the book...'
          }
          disabled={isLoading}
          className="chat-input"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !currentInput.trim()}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBotContainer;