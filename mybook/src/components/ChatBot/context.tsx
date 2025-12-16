// Context for managing chat state across components
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatState, ChatMessage, ModeType } from './types';

// Define actions for the reducer
type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_CURRENT_INPUT'; payload: string }
  | { type: 'SET_MODE'; payload: ModeType }
  | { type: 'SET_SELECTED_TEXT'; payload: string | undefined }
  | { type: 'CLEAR_MESSAGES' };

// Initial state
const initialState: ChatState = {
  messages: [],
  currentInput: '',
  isLoading: false,
  mode: 'BOOK',
  selectedText: undefined,
};

// Reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        error: undefined
      };
    case 'UPDATE_CURRENT_INPUT':
      return { ...state, currentInput: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_SELECTED_TEXT':
      return { ...state, selectedText: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
};

// Context type
interface ChatContextType extends ChatState {
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (message: string) => Promise<void>;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Function to send a message
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: undefined });

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      dispatch({ type: 'UPDATE_CURRENT_INPUT', payload: '' });

      // Prepare request to backend
      const request = {
        content: message,
        mode: state.mode,
        selected_text: state.mode === 'SELECTION' ? state.selectedText : undefined,
      };

      // Send to backend
      const { ChatService } = await import('./api');
      const response = await ChatService.sendMessage(request);

      // Add assistant response to UI
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        citations: response.citations,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Failed to get response: ${errorMessage}` 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ChatContext.Provider value={{ ...state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use the context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};