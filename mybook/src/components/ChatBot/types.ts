// Types for the RAG Chatbot integration

export type ModeType = 'BOOK' | 'SELECTION';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  chapter?: string;
  section?: string;
  url?: string;
}

export interface ChatRequest {
  content: string;
  mode: ModeType;
  selected_text?: string;
}

export interface ChatResponse {
  content: string;
  citations?: Citation[];
  confidence?: number;
}

export interface ChatState {
  messages: ChatMessage[];
  currentInput: string;
  isLoading: boolean;
  error?: string;
  mode: ModeType;
  selectedText?: string;
}