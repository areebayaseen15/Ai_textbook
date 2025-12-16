# Implementation Plan: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

**Branch**: `1-rag-chatbot-book` | **Date**: 2025-12-16 | **Spec**: [specs/1-rag-chatbot-book/spec.md](specs/1-rag-chatbot-book/spec.md)
**Input**: Feature specification from `/specs/1-rag-chatbot-book/spec.md`

## Summary

Implementation of a RAG chatbot that enables users to ask questions about the Physical AI & Humanoid Robotics book. The system will support both BOOK MODE (full book retrieval) and SELECTION MODE (selected text only), with strict enforcement against hallucinations and proper citation of sources. The system will be built with FastAPI backend, Qdrant vector database, and Neon Postgres for logging.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, Qdrant, Cohere, Pydantic, SQLAlchemy
**Storage**: Neon Serverless Postgres for logs, Qdrant Cloud for vector embeddings
**Testing**: pytest, unittest
**Target Platform**: Linux server deployment
**Project Type**: Web API with potential Docusaurus frontend integration
**Performance Goals**: <200ms response time for queries, support concurrent users
**Constraints**: <=200 word responses, 300-500 token chunks, no hallucinations
**Scale/Scope**: Hackathon project supporting judges and technical users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Accuracy**: All responses must be grounded in book content (Vercel URL: https://ai-textbook-orcin.vercel.app/)
- **Non-hallucination**: System must NOT fabricate information; respond with "The answer is not found in the selected text." when no relevant content exists
- **Clarity**: Responses must be understandable for technical and non-technical users; <=200 words per response
- **Traceability**: Each answer should reference source chapter/section when possible with proper citations
- **Security & Safety**: User data and chat logs must be handled responsibly; store logs in Neon Postgres
- **RAG Modes**: BOOK MODE must retrieve from full book via Qdrant; SELECTION MODE must answer ONLY from user-selected text and ignore vector DB

## Project Structure

### Documentation (this feature)
```text
specs/1-rag-chatbot-book/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
```text
backend/
├── src/
│   ├── models/
│   │   ├── question.py
│   │   ├── response.py
│   │   ├── text_selection.py
│   │   └── chat_log.py
│   ├── services/
│   │   ├── rag_service.py
│   │   ├── ingestion_service.py
│   │   ├── qdrant_service.py
│   │   └── logging_service.py
│   ├── api/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── chat.py
│   │   │   └── ingestion.py
│   │   └── schemas/
│   │       ├── request.py
│   │       └── response.py
│   ├── config/
│   │   └── settings.py
│   └── utils/
│       ├── scraper.py
│       └── text_processor.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
└── requirements.txt
```

**Structure Decision**: Web application structure with backend API and potential frontend integration. Backend in `backend/` directory with models, services, API routes, and configuration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Phase 0: Research & Unknowns Resolution

### Research Tasks

1. **Qdrant Integration Research**
   - Decision: Use Qdrant Cloud Free Tier with provided credentials
   - Rationale: Cost-effective vector database with good Python integration for RAG
   - Alternatives considered: Pinecone, Weaviate, local Chroma

2. **Cohere API Usage**
   - Decision: Use Cohere for embeddings and potential LLM capabilities
   - Rationale: Good performance for RAG applications and document processing
   - Alternatives considered: OpenAI embeddings, Hugging Face models

3. **Book Content Extraction**
   - Decision: Scrape content from Vercel deployment (https://ai-textbook-orcin.vercel.app/)
   - Rationale: Most up-to-date content available in web format
   - Alternatives considered: PDF extraction, manual content entry

4. **FastAPI Implementation Strategy**
   - Decision: Use FastAPI for backend with async support
   - Rationale: High-performance, automatic API documentation, Pydantic integration
   - Alternatives considered: Flask, Django REST Framework

5. **Mode Switching Architecture**
   - Decision: Implement clear separation between BOOK MODE and SELECTION MODE
   - Rationale: Critical to meet non-hallucination requirements and specification
   - Alternatives considered: Hybrid approach (rejected due to complexity)

## Phase 1: Design & Architecture

### Data Model Design

**Question**
- Fields: id, content, mode (BOOK/SELECTION), timestamp, user_context
- Validation: Content required, mode enum, timestamp defaults to now

**Response**
- Fields: id, content, citations, confidence, source_passages, question_id
- Validation: Content required, citations optional, source_passages for traceability

**TextSelection**
- Fields: id, content, start_position, end_position, page/chapter_reference
- Validation: Content required, position bounds valid

**ChatLog**
- Fields: id, question_content, response_content, mode, timestamp, user_id (optional)
- Validation: Required fields for audit trail

### API Contracts

**POST /api/chat**
- Input: Question text, mode (BOOK or SELECTION), optional selected_text
- Output: Response with citations
- Error: "The answer is not found in the selected text."

**POST /api/ingest**
- Input: URL of book content (for initial setup)
- Output: Status of ingestion process
- Error: Ingestion failures

**GET /api/health**
- Output: System health status
- Error: Health check failures

### Quickstart Guide

1. Install dependencies: `pip install -r requirements.txt`
2. Set environment variables for Qdrant, Cohere, and Neon
3. Run ingestion: `python -m src.services.ingestion_service`
4. Start server: `uvicorn src.api.main:app --reload`
5. Test at: `http://localhost:8000/docs`

## Phase 2: Implementation Planning

### User Story 1 - Ask Questions from Full Book (P1)

**Implementation Tasks:**
- Set up Qdrant collection for book embeddings
- Create ingestion service to scrape and embed book content
- Implement BOOK MODE RAG logic
- Add citation extraction to responses
- Create API endpoint for chat interactions

### User Story 2 - Ask Questions from Selected Text (P2)

**Implementation Tasks:**
- Implement SELECTION MODE logic that ignores vector DB
- Create text processing for user-selected content
- Add mode switching validation
- Ensure strict enforcement of SELECTION MODE requirements

### User Story 3 - Mode Verification and Citations (P3)

**Implementation Tasks:**
- Add logging to Neon Postgres for all interactions
- Implement citation extraction from source documents
- Add response length limiting to <=200 words
- Create verification tools for judges to validate responses

## Technology Stack & Integration Points

### Backend Services
- FastAPI: Main application framework with automatic docs
- Pydantic: Data validation and serialization
- SQLAlchemy: Database interactions with Neon Postgres
- AsyncIO: For efficient concurrent request handling

### AI/ML Components
- Cohere: Embeddings and potential LLM for responses
- Qdrant: Vector similarity search for RAG
- Text processing: Chunking, cleaning, and preparation

### External Services
- Qdrant Cloud: Vector database (Endpoint: a5e2835a-0259-41f8-b7b7-e535bf836f63.europe-west3-0.gcp.cloud.qdrant.io:6333)
- Neon Postgres: Logging and audit trail
- Vercel Book URL: https://ai-textbook-orcin.vercel.app/ (source for embeddings)

## Risk Assessment

### High Risk Items
- Book content scraping reliability from Vercel deployment
- Qdrant vector search accuracy for RAG responses
- Mode switching logic complexity to prevent hallucinations

### Mitigation Strategies
- Implement fallback mechanisms for content extraction
- Comprehensive testing of both RAG modes
- Strict validation of mode enforcement in SELECTION MODE