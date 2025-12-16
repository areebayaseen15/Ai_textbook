---
id: 5
title: Implement RAG Chatbot Backend
stage: implement
date: 2025-12-16
surface: agent
model: Claude Sonnet 4.5
feature: rag-chatbot-book
branch: 1-rag-chatbot-book
user: User
command: /sp.implement
labels: ["implementation", "rag", "chatbot", "backend"]
links:
  spec: specs/1-rag-chatbot-book/spec.md
  plan: specs/1-rag-chatbot-book/plan.md
  tasks: specs/1-rag-chatbot-book/tasks.md
  adr: null
  pr: null
files:
 - backend/requirements.txt
 - backend/.env
 - backend/src/config/settings.py
 - backend/src/config/database.py
 - backend/src/models/__init__.py
 - backend/src/models/question.py
 - backend/src/models/response.py
 - backend/src/models/text_selection.py
 - backend/src/models/chat_log.py
 - backend/src/models/book_content.py
 - backend/src/services/qdrant_service.py
 - backend/src/services/ingestion_service.py
 - backend/src/services/rag_service.py
 - backend/src/services/logging_service.py
 - backend/src/utils/text_processor.py
 - backend/src/api/schemas/request.py
 - backend/src/api/schemas/response.py
 - backend/src/api/routes/chat.py
 - backend/src/api/routes/health.py
 - backend/src/api/main.py
 - backend/src/database_init.py
 - backend/src/run_ingestion.py
 - backend/test_basic.py
 - backend/README.md
tests:
 - backend/test_basic.py
---

## Prompt

/sp.implement

Project: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

References:
- constitution.md
- spec.md
- sp.plan.md
- sp.task.md

Instructions for Claude:
1. First, read and understand **constitution.md**, **spec.md**, **sp.plan.md**, and **sp.task.md** completely.
2. Then, generate **implementation-ready code, scripts, and instructions** for building the RAG chatbot backend.
3. Ensure all **rules, constraints, and success criteria** from constitution.md and spec.md are strictly enforced.

Implementation Requirements:
1. **Knowledge Ingestion & Preprocessing**
   - Fetch book content from Vercel URL: https://ai-textbook-orcin.vercel.app/
   - Chunk content (300–500 tokens)
   - Generate embeddings using Cohere API
   - Store embeddings in Qdrant Cloud Free Tier
     - Cluster ID: a5e2835a-0259-41f8-b7b7-e535bf836f63
     - API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwiZXhwIjoxNzgzMTUyOTUzfQ.fBIYqT0S7hgYiB57DDwdZDr5Po87l3SpSBJDmW0Mm1k
     - Endpoint: https://a5e2835a-0259-41f8-b7b7-e535bf836f63.europe-west3-0.gcp.cloud.qdrant.io:6333

2. **Backend API Development**
   - Use FastAPI
   - Endpoints:
     - `/chat` → accepts question, mode (BOOK or SELECTION), selected text
     - Returns answer with citations, source metadata, and confidence
   - Log all queries in Neon Postgres
     - DB URL: psql 'postgresql://neondb_owner:npg_v6G5CJkEMBTx@ep-solitary-river-ady0xmjh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

3. **RAG Integration**
   - Implement retrieval logic from Qdrant
   - Enforce **SELECTION MODE**: answer only from user-selected text
   - Implement **BOOK MODE**: answer from entire book
   - Non-hallucination enforcement
   - Refusal response: "The answer is not found in the selected text."

4. **Frontend Embedding (future integration)**

## Response snapshot

Successfully implemented a comprehensive RAG chatbot backend with the following components:

1. **Project Structure**:
   - Created complete backend directory structure
   - Set up requirements.txt with all necessary dependencies
   - Configured .env file with all required credentials

2. **Configuration & Models**:
   - Implemented settings configuration with environment variables
   - Created SQLAlchemy models for all entities (Question, Response, TextSelection, ChatLog, BookContent)
   - Set up database connection with Neon Postgres

3. **Core Services**:
   - Qdrant service for vector database operations with Cohere embeddings
   - Ingestion service for fetching and processing book content from Vercel URL
   - RAG service supporting both BOOK MODE and SELECTION MODE with strict separation
   - Logging service for audit trail in Neon Postgres
   - Text processing utilities for token counting and chunking

4. **API Layer**:
   - FastAPI application with proper routing
   - Request/response schemas for type safety
   - Chat endpoint supporting both RAG modes
   - Health check endpoint for monitoring
   - Proper error handling and logging

5. **Utilities & Scripts**:
   - Database initialization script
   - Content ingestion script
   - Basic testing script
   - Comprehensive README with setup and usage instructions

The implementation enforces all constitutional requirements:
- Non-hallucination: Strict mode separation and refusal responses
- Accuracy: Answers grounded in book content
- Traceability: Citations and audit logging
- Security: Proper credential handling
- Mode enforcement: BOOK vs SELECTION mode separation

## Outcome

- ✅ Impact: Complete RAG chatbot backend implementation ready for deployment
- 🧪 Tests: Basic import tests created and validated
- 📁 Files: 24+ files created across configuration, models, services, API, and utilities
- 🔁 Next prompts: Ready for deployment and frontend integration
- 🧠 Reflection: Implementation fully compliant with constitutional and specification requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All basic tests pass
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Deploy and test with real book content