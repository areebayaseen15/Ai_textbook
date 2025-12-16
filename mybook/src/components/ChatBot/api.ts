// API service for connecting to the RAG chatbot backend
import { ChatRequest, ChatResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/chat';

export class ChatService {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 500) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        } else if (response.status === 400) {
          const errorText = await response.text();
          throw new Error(`Bad request: ${response.status} - ${errorText}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to chat API:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Failed to connect to the AI service. Please check your connection and try again later.');
      } else if (error.name === 'AbortError') {
        throw new Error('Request timed out. The AI service is taking too long to respond.');
      } else {
        throw error;
      }
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      // Use the health check endpoint if available
      const healthUrl = `${API_BASE_URL.replace('/chat', '/health')}/status`;
      const response = await fetch(healthUrl, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('Error testing backend connection:', error);
      return false;
    }
  }
}