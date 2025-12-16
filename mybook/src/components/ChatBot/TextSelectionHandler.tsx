// Component to handle text selection detection
import React, { useEffect } from 'react';

interface TextSelectionHandlerProps {
  onTextSelected: (selectedText: string) => void;
}

const TextSelectionHandler: React.FC<TextSelectionHandlerProps> = ({ onTextSelected }) => {
  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        onTextSelected(selectedText);
      }
    };

    // Add event listeners for text selection
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, [onTextSelected]);

  return null; // This component doesn't render anything
};

export default TextSelectionHandler;