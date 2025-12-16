import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  citations?: Citation[];
}

interface Citation {
  chapter?: string;
  section?: string;
  url?: string;
}

interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  mode: 'BOOK' | 'SELECTION';
  selectedText: string;
  isOpen: boolean; // Add isOpen state
}

const SimpleChatUI: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    input: '',
    isLoading: false,
    mode: 'BOOK',
    selectedText: '',
    isOpen: false // Initially closed as a floating widget
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (state.isOpen && state.messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hello! I'm your AI assistant for the Physical AI & Humanoid Robotics textbook. Ask me anything about the book content!",
        role: 'assistant'
      };

      setState(prev => ({
        ...prev,
        messages: [welcomeMessage]
      }));
    }
  }, [state.isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (state.isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, state.isOpen]);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        setState(prev => ({ ...prev, selectedText }));
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSendMessage = async () => {
    if (!state.input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: state.input,
      role: 'user'
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      input: '',
      isLoading: true
    }));

    try {
      // Simulate API call - in a real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response based on mode
      let content = '';
      let citations: Citation[] = [];

      if (state.mode === 'SELECTION' && state.selectedText) {
        if (state.selectedText.toLowerCase().includes('robot') || state.input.toLowerCase().includes('robot')) {
          content = "Based on the selected text, humanoid robots use advanced control systems to perform tasks. They integrate sensors, actuators, and AI algorithms for autonomous operation.";
          citations = [{ chapter: 'Chapter 4', section: 'Section 4.2', url: 'https://ai-textbook-orcin.vercel.app/' }];
        } else {
          content = "The selected text does not contain information about this topic. The answer is not found in the selected text.";
        }
      } else {
        // Book mode - general response about robotics
        if (state.input.toLowerCase().includes('ros')) {
          content = "ROS (Robot Operating System) is a flexible framework for writing robot software. It provides services designed for a heterogeneous computer cluster such as hardware abstraction, device drivers, libraries, visualizers, message-passing, package management, and more.";
          citations = [{ chapter: 'Chapter 1', section: 'Section 1.2', url: 'https://ai-textbook-orcin.vercel.app/' }];
        } else if (state.input.toLowerCase().includes('ai')) {
          content = "Artificial Intelligence in robotics involves using machine learning algorithms, computer vision, and natural language processing to enable robots to perceive, reason, and act in complex environments. Modern AI techniques include deep learning, reinforcement learning, and transformer models.";
          citations = [{ chapter: 'Chapter 3', section: 'Section 3.1', url: 'https://ai-textbook-orcin.vercel.app/' }];
        } else {
          content = "Based on the book content, Physical AI and Humanoid Robotics involve complex systems combining mechanical engineering, electronics, and artificial intelligence to create autonomous agents capable of performing human-like tasks.";
          citations = [{ chapter: 'Chapter 1', section: 'Introduction', url: 'https://ai-textbook-orcin.vercel.app/' }];
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        role: 'assistant',
        citations
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        role: 'assistant'
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  // If chat is closed, show only the floating button
  if (!state.isOpen) {
    return (
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2e8555', // Green color to match theme
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
        aria-label="Open chat"
      >
        💬
      </button>
    );
  }

  // If chat is open, show the full chat interface
  return (
    <div style={{
      position: 'fixed',
      bottom: '90px', // Position above the chat button
      right: '20px',
      width: '400px',
      height: '500px', // Reduced height
      border: '1px solid #ddd',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2e8555', // Green color to match theme
        color: 'white',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          textAlign: 'center',
          color: 'white',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          AI Textbook Assistant
        </h2>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '30px' // More space between title and mode buttons
        }}>
          <button
            style={{
              backgroundColor: state.mode === 'BOOK' ? 'white' : 'rgba(255,255,255,0.2)',
              color: state.mode === 'BOOK' ? '#2e8555' : 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setState(prev => ({ ...prev, mode: 'BOOK' }))}
          >
            BOOK MODE
          </button>
          <button
            style={{
              backgroundColor: state.mode === 'SELECTION' ? 'white' : 'rgba(255,255,255,0.2)',
              color: state.mode === 'SELECTION' ? '#2e8555' : 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setState(prev => ({ ...prev, mode: 'SELECTION' }))}
          >
            SELECTION MODE
          </button>
        </div>
        <button
          onClick={toggleChat}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: '16px',
            top: '16px',
            borderRadius: '50%',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ×
        </button>
      </div>

      {/* Mode indicator */}
      {state.mode === 'SELECTION' && state.selectedText && (
        <div style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '10px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <strong>Selected: </strong> <span style={{ marginLeft: '6px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{state.selectedText.substring(0, 60)}{state.selectedText.length > 60 ? '...' : ''}</span>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f9fafb'
      }}>
        {state.messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: message.role === 'user' ? '#e0f2fe' : '#ffffff', // Light blue for user, white for bot
                border: message.role === 'user' ? '1px solid #7dd3fc' : '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                fontSize: '14px',
                lineHeight: '1.5',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                {message.content}
              </div>

              {message.citations && message.citations.length > 0 && (
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  paddingTop: '8px',
                  borderTop: '1px dashed #e5e7eb',
                  marginTop: '8px'
                }}>
                  <strong>Sources:</strong>
                  {message.citations.map((citation, idx) => (
                    <div key={idx} style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                      {citation.chapter && <span style={{ marginRight: '8px' }}>{citation.chapter}</span>}
                      {citation.section && <span style={{ marginRight: '8px' }}>{citation.section}</span>}
                      {citation.url && (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#2e8555',
                            textDecoration: 'underline',
                            fontSize: '11px'
                          }}
                        >
                          View Source
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {state.isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>Thinking</div>
                <div style={{
                  marginLeft: '8px',
                  display: 'flex'
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#6b7280',
                    borderRadius: '50%',
                    margin: '0 2px',
                    animation: 'bounce 1.4s infinite ease-in-out'
                  }}>•</div>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#6b7280',
                    borderRadius: '50%',
                    margin: '0 2px',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: '0.2s'
                  }}>•</div>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#6b7280',
                    borderRadius: '50%',
                    margin: '0 2px',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: '0.4s'
                  }}>•</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        display: 'flex'
      }}>
        <textarea
          value={state.input}
          onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
          onKeyPress={handleKeyPress}
          placeholder={state.mode === 'SELECTION' && state.selectedText
            ? 'Ask about the selected text...'
            : 'Ask a question about the book...'}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '20px',
            resize: 'vertical',
            minHeight: '50px',
            fontSize: '14px',
            maxHeight: '100px',
            outline: 'none'
          }}
          autoFocus
          onFocus={(e) => e.target.style.borderColor = '#2e8555'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={handleSendMessage}
          disabled={state.isLoading || !state.input.trim()}
          style={{
            marginLeft: '10px',
            padding: '12px 20px',
            backgroundColor: state.isLoading || !state.input.trim() ? '#9ca3af' : '#2e8555', // Green color to match theme
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: state.isLoading || !state.input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!(state.isLoading || !state.input.trim())) {
              e.currentTarget.style.backgroundColor = '#2a7a4d';
            }
          }}
          onMouseLeave={(e) => {
            if (!(state.isLoading || !state.input.trim())) {
              e.currentTarget.style.backgroundColor = '#2e8555';
            }
          }}
        >
          {state.isLoading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
};

export default SimpleChatUI;