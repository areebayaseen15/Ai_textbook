# RAG Chatbot Backend for Physical AI & Humanoid Robotics Book

This backend implements a Retrieval-Augmented Generation (RAG) chatbot that allows users to ask questions about the Physical AI & Humanoid Robotics book. The system supports both BOOK MODE (full book retrieval) and SELECTION MODE (selected text only) with strict non-hallucination enforcement.

## Features

- **Dual RAG Modes**:
  - BOOK MODE: Retrieve answers from the entire book via Qdrant vector search
  - SELECTION MODE: Answer ONLY from user-selected text; ignore vector database
- **Non-hallucination Enforcement**: System will respond with "The answer is not found in the selected text." when no relevant content exists
- **Citation Tracking**: Responses include references to book chapters, sections, and URLs
- **Audit Logging**: All interactions are logged in Neon Postgres for verification
- **Response Control**: Answers limited to 200 words unless quoting context directly

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   FastAPI API    │───▶│  Qdrant Vector  │
│   (Docusaurus)  │    │   (Backend)      │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Cohere API      │
                    │  (Embeddings/LLM) │
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Neon Postgres    │
                    │   (Audit Logs)    │
                    └───────────────────┘
```

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   Copy the `.env` file and ensure all credentials are properly set:
   - Qdrant API credentials
   - Cohere API key
   - Neon Postgres connection string

3. **Initialize database tables**:
   ```bash
   python -m src.database_init
   ```

4. **Ingest book content**:
   ```bash
   python -m src.run_ingestion
   ```

## API Endpoints

### Chat Endpoint
- **POST** `/api/chat/`
- **Request Body**:
  ```json
  {
    "content": "Your question here",
    "mode": "BOOK" or "SELECTION",
    "selected_text": "Optional text for SELECTION MODE"
  }
  ```
- **Response**:
  ```json
  {
    "content": "The answer to your question",
    "citations": [
      {
        "chapter": "Chapter name",
        "section": "Section name",
        "url": "Reference URL"
      }
    ],
    "confidence": 0.8
  }
  ```

### Health Check
- **GET** `/api/health/`
- **Response**:
  ```json
  {
    "status": "healthy",
    "services": {
      "qdrant": "connected",
      "database": "connected",
      "api": "running"
    }
  }
  ```

### Ingestion
- **POST** `/api/chat/ingest`
- **Response**:
  ```json
  {
    "status": "success",
    "chunks_processed": 45,
    "message": "Successfully ingested 45 content chunks"
  }
  ```

## Running the Application

Start the development server:
```bash
uvicorn src.api.main:app --reload
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## Environment Variables

The application requires the following environment variables in `.env`:

- `QDRANT_HOST`: Qdrant Cloud host
- `QDRANT_PORT`: Qdrant Cloud port (default: 6333)
- `QDRANT_API_KEY`: Qdrant API key
- `QDRANT_COLLECTION_NAME`: Collection name for book content
- `COHERE_API_KEY`: Cohere API key for embeddings
- `DATABASE_URL`: Neon Postgres connection string
- `APP_TITLE`: Application title
- `APP_VERSION`: Application version
- `DEBUG`: Debug mode (true/false)

## Non-Hallucination Enforcement

The system strictly enforces non-hallucination through:

1. **Mode Separation**: BOOK MODE and SELECTION MODE use completely different retrieval paths
2. **Content Validation**: Responses are only generated from verified content sources
3. **Refusal Mechanism**: When no relevant content exists, the system responds with "The answer is not found in the selected text."
4. **Audit Trail**: All interactions are logged for verification

## Testing

Run basic import tests:
```bash
python test_basic.py
```

## Security & Privacy

- All user interactions are logged for audit purposes
- No user data is stored beyond what's required for functionality
- API keys are stored securely in environment variables
- Connection to external services is encrypted