---
id: 2
title: Create RAG Chatbot Spec
stage: spec
date: 2025-12-16
surface: agent
model: Claude Sonnet 4.5
feature: rag-chatbot-book
branch: 1-rag-chatbot-book
user: User
command: /sp.specify
labels: ["spec", "rag", "chatbot", "ai"]
links:
  spec: specs/1-rag-chatbot-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-rag-chatbot-book/spec.md
 - specs/1-rag-chatbot-book/checklists/requirements.md
tests:
 -
---

## Prompt

/sp.specify

Project: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

Target audience: Hackathon judges and technical users of the book

Focus:
- Answer user questions about the book content
- Support both full-book retrieval and user-selected-text retrieval
- Ensure answers are grounded in context and traceable

Success criteria:
- Correctly retrieves and answers questions from the book content
- Honors SELECTION MODE (answer only from highlighted text)
- Zero hallucinations or fabricated responses
- Mode enforcement verified (BOOK vs SELECTION)
- Citations/reference to chapter, section, or URL included when possible
- Chat logs stored for audit in Neon Postgres
- Judges can verify answers against original book content

Constraints:
- Backend: FastAPI
- Vector search: Qdrant Cloud Free Tier
- Cluster ID: a5e2835a-0259-41f8-b7b7-e535bf836f63
- Qdrant API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwiZXhwIjoxNzgzMTUyOTUzfQ.fBIYqT0S7hgYiB57DDwdZDr5Po87l3SpSBJDmW0Mm1k
- Qdrant link: https://a5e2835a-0259-41f8-b7b7-e535bf836f63.europe-west3-0.gcp.cloud.qdrant.io:6333
- Database: Neon Serverless Postgres
- Neon DB URL: psql 'postgresql://neondb_owner:npg_v6G5CJkEMBTx@ep-solitary-river-ady0xmjh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
- Embeddings / LLM: Cohere
- Cohere API: xciLbjDe9DW6uRAWdDK1O5ypkBw4gP5lnEKN4OjB
- Chunk size: 300–500 tokens
- Answer length: concise, <=200 words unless quoting context
- Observability: log user question, mode, timestamp
- Refusal: respond "The answer is not found in the selected text." if no relevant content

Not building:
- Answering outside book content or selected text
- General AI discussion unrelated to the book
- Full research reports or external citations
- Implementation guides beyond RAG integration

Output format:
- Markdown source for `spec.md`
- Sections clearly labeled: Target Audience, Focus, Success Criteria, Constraints, Not Building
- Ready-to-use for Claude Code to generate ingestion + RAG backend scripts

## Response snapshot

Created a comprehensive specification for the Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book with the following elements:

1. Three user stories with priorities:
   - P1: Ask Questions from Full Book
   - P2: Ask Questions from Selected Text
   - P3: Mode Verification and Citations

2. Nine functional requirements covering:
   - Content-based responses only
   - Dual mode support (BOOK and SELECTION)
   - No hallucination enforcement
   - Proper refusal responses
   - Citations
   - Logging
   - Mode enforcement
   - Answer length limits
   - Text processing

3. Seven measurable success criteria including:
   - 100% response accuracy
   - 100% mode enforcement
   - 95% citation rate
   - 100% proper refusal handling
   - Audit logging
   - Verifiability
   - Concise answers

4. Four key entities defined

The specification was made technology-agnostic by removing specific implementation details like database names and API keys while preserving the functional requirements.

## Outcome

- ✅ Impact: Complete feature specification created for RAG chatbot
- 🧪 Tests: No tests required for specification creation
- 📁 Files: specs/1-rag-chatbot-book/spec.md and specs/1-rag-chatbot-book/checklists/requirements.md created
- 🔁 Next prompts: Ready for planning phase with /sp.plan
- 🧠 Reflection: Specification successfully abstracted implementation details while preserving functional requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with feature planning