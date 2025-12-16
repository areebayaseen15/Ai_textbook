# Research: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

**Feature**: 1-rag-chatbot-book
**Date**: 2025-12-16
**Researcher**: Claude

## Overview

Research completed for implementing a RAG chatbot that supports both BOOK MODE and SELECTION MODE for the Physical AI & Humanoid Robotics book, with strict non-hallucination requirements and proper citation handling.

## Decision: Qdrant Integration Strategy

**Rationale**: Qdrant Cloud Free Tier was selected as the vector database solution due to its Python SDK compatibility, performance characteristics suitable for RAG applications, and free tier availability for hackathon development. The provided endpoint and credentials enable immediate integration.

**Alternatives considered**:
- Pinecone: More expensive, good for production but overkill for hackathon
- Weaviate: Self-hosting required, more complex setup
- ChromaDB: Local-only, doesn't meet cloud requirements

## Decision: Content Extraction Method

**Rationale**: Web scraping from the Vercel deployment (https://ai-textbook-orcin.vercel.app/) was selected as the content source because it provides the most current version of the book content in a structured format that can be processed into embeddings.

**Alternatives considered**:
- PDF extraction: Would require separate PDF access, potential formatting issues
- Manual content entry: Time-intensive and error-prone
- API access: Not available for the Vercel deployment

## Decision: LLM and Embedding Provider

**Rationale**: Cohere was selected for embeddings due to its strong performance in document similarity tasks and good Python SDK support. The provided API key enables immediate integration.

**Alternatives considered**:
- OpenAI embeddings: Would require separate API key and billing setup
- Hugging Face models: Self-hosting required, higher complexity
- Sentence Transformers: Local processing, slower for large documents

## Decision: Backend Framework

**Rationale**: FastAPI was selected as the backend framework due to its high performance, automatic API documentation generation (Swagger UI), built-in Pydantic integration for data validation, and async support for handling concurrent requests.

**Alternatives considered**:
- Flask: Simpler but less performant, no automatic docs
- Django: Overkill for API-only application
- Express.js: Would require switching to Node.js ecosystem

## Decision: Mode Switching Architecture

**Rationale**: A clear separation between BOOK MODE and SELECTION MODE was designed to strictly enforce the non-hallucination requirements. In BOOK MODE, the system will query the Qdrant vector database for relevant passages from the book. In SELECTION MODE, the system will only process the user-provided text selection without accessing the vector database.

**Alternatives considered**:
- Hybrid approach: Combining both modes could lead to hallucination violations
- Separate services: Would add unnecessary complexity for hackathon scope

## Decision: Database Strategy

**Rationale**: Neon Serverless Postgres was selected for audit logging due to its serverless nature (no infrastructure management), PostgreSQL compatibility, and easy integration with Python applications.

**Alternatives considered**:
- SQLite: Local storage, not suitable for deployed application
- MongoDB: NoSQL approach would complicate audit trail requirements
- In-memory storage: Would lose logs on restart

## Decision: Frontend Integration

**Rationale**: Docusaurus frontend embedding was selected as the potential frontend approach since it's commonly used for documentation sites and could allow embedding the chatbot directly into the book's existing documentation structure.

**Alternatives considered**:
- Standalone React app: Would require separate deployment
- Vanilla JavaScript widget: Less maintainable
- No frontend: Would limit user accessibility

## Technical Challenges Identified

1. **Content Scraping Reliability**: The Vercel deployment structure may change, requiring updates to scraping logic
2. **Token Chunking Strategy**: Balancing 300-500 token chunks for optimal RAG performance
3. **Mode Switching Validation**: Ensuring SELECTION MODE never accesses vector database
4. **Citation Accuracy**: Properly tracking source locations in the original book content
5. **Response Length Control**: Ensuring responses stay under 200 words while remaining helpful

## Implementation Recommendations

1. Implement robust error handling for content scraping operations
2. Create a flexible chunking system that can adapt to different content structures
3. Use clear architectural boundaries between the two RAG modes
4. Implement comprehensive logging for audit purposes
5. Design the API to be easily testable for both modes