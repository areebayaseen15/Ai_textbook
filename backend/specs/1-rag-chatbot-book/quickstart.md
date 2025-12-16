# Quickstart Guide: RAG Chatbot for Physical AI & Humanoid Robotics Book

**Feature**: 1-rag-chatbot-book
**Date**: 2025-12-16

## Overview

This guide will help you set up and run the RAG chatbot that enables users to ask questions about the Physical AI & Humanoid Robotics book. The system supports both BOOK MODE (full book retrieval) and SELECTION MODE (selected text only) with strict non-hallucination enforcement.

## Prerequisites

- Python 3.11 or higher
- pip package manager
- Access to Qdrant Cloud (endpoint and API key)
- Access to Cohere API
- Access to Neon Postgres (connection string)

## Environment Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   Or if requirements.txt doesn't exist yet, install the required packages:
   ```bash
   pip install fastapi uvicorn qdrant-client cohere psycopg2-binary sqlalchemy python-dotenv pydantic
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following:
   ```env
   # Qdrant Configuration
   QDRANT_HOST=a5e2835a-0259-41f8-b7b7-e535bf836f63.europe-west3-0.gcp.cloud.qdrant.io
   QDRANT_PORT=6333
   QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwiZXhwIjoxNzgzMTUyOTUzfQ.fBIYqT0S7hgYiB57DDwdZDr5Po87l3SpSBJDmW0Mm1k
   QDRANT_COLLECTION_NAME=book_content

   # Cohere Configuration
   COHERE_API_KEY=xciLbjDe9DW6uRAWdDK1O5ypkBw4gP5lnEKN4OjB

   # Neon Postgres Configuration
   DATABASE_URL=postgresql://neondb_owner:npg_v6G5CJkEMBTx@ep-solitary-river-ady0xmjh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

   # Application Settings
   APP_TITLE=RAG Chatbot for Physical AI & Humanoid Robotics Book
   APP_VERSION=1.0.0
   DEBUG=True
   ```

## Initial Setup: Ingest Book Content

1. **Run the content ingestion:**
   ```bash
   python -m src.services.ingestion_service
   ```

   This will:
   - Scrape content from https://ai-textbook-orcin.vercel.app/
   - Process it into 300-500 token chunks
   - Store embeddings in Qdrant vector database
   - Log the process for audit

2. **Verify ingestion:**
   Check the console output for the number of chunks processed and any errors.

## Running the Application

1. **Start the API server:**
   ```bash
   uvicorn src.api.main:app --reload
   ```

2. **Access the API:**
   - API documentation: http://localhost:8000/docs
   - Health check: http://localhost:8000/api/health

## Testing the RAG Functionality

### Test BOOK MODE (Full Book Retrieval)
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What are the key principles of physical AI?",
    "mode": "BOOK",
    "selectedText": null
  }'
```

### Test SELECTION MODE (Selected Text Only)
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What does this text say about robot learning?",
    "mode": "SELECTION",
    "selectedText": "Robots can learn through physical interaction with their environment. This learning approach combines sensory input with motor actions to improve performance over time."
  }'
```

### Test Refusal Response (No Relevant Content)
Try asking a question unrelated to the book content to verify the system responds with "The answer is not found in the selected text."

## API Endpoints

- `POST /api/chat` - Submit questions and get RAG responses
- `POST /api/ingest` - Ingest book content (run once initially)
- `GET /api/health` - Check system health
- `GET /docs` - Interactive API documentation (Swagger UI)

## Key Features Verification

1. **Non-hallucination**: Verify that the system never fabricates information
2. **Mode enforcement**: Confirm SELECTION MODE ignores vector database
3. **Citations**: Check that responses include chapter/section references
4. **Response length**: Ensure responses are <=200 words
5. **Audit logging**: Verify all interactions are logged to Neon Postgres

## Troubleshooting

- **Connection errors**: Verify environment variables are set correctly
- **No responses**: Check that content ingestion completed successfully
- **Slow responses**: May indicate issues with vector database connection
- **No citations**: Check that the book content was properly parsed with source references

## Next Steps

1. Integrate with Docusaurus frontend for embedding in the book
2. Implement comprehensive testing suite
3. Add additional monitoring and observability
4. Performance optimization based on usage patterns