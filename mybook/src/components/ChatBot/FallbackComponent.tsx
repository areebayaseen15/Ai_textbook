// Fallback component for when backend is unavailable
import React from 'react';

interface FallbackComponentProps {
  error?: string;
  onRetry?: () => void;
}

const FallbackComponent: React.FC<FallbackComponentProps> = ({ error, onRetry }) => {
  return (
    <div className="fallback-container">
      <div className="fallback-content">
        <h3>⚠️ Service Unavailable</h3>
        <p>
          {error 
            ? `Error: ${error}` 
            : 'The AI assistant is currently unavailable. Please try again later.'}
        </p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Retry Connection
          </button>
        )}
        <div className="fallback-instructions">
          <p><strong>Book Mode:</strong> Ask questions about the entire book content</p>
          <p><strong>Selection Mode:</strong> Highlight text and ask questions about only that selected text</p>
        </div>
      </div>
    </div>
  );
};

export default FallbackComponent;