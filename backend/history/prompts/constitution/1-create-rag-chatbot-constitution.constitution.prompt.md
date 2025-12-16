---
id: 1
title: Create RAG Chatbot Constitution
stage: constitution
date: 2025-12-16
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: User
command: /sp.constitution
labels: ["constitution", "rag", "chatbot", "ai"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 -
---

## Prompt

/sp.constitution

Project: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

Core principles:
- Accuracy: All answers grounded in book content or user-selected text
- Non-hallucination: Assistant MUST NOT fabricate information
- Clarity: Responses understandable for technical and non-technical users
- Traceability: Each answer should reference source chapter/section when possible
- Security & Safety: User data and chat logs handled responsibly

Key standards:
- RAG Modes:
  - BOOK MODE: retrieve answers from full book via Qdrant vector search
  - SELECTION MODE: answer ONLY from user-selected text; ignore vector DB
- Refusal rule: If answer not present in context, respond: "The answer is not found in the selected text."
- Prompt rules: LLM must not include external knowledge beyond allowed sources
- Observability: Store chat logs, timestamps, mode, and question in Neon Postgres
- Tech stack: FastAPI backend, ChatKit / OpenAI Agents, Qdrant Cloud Free Tier, Neon Serverless

Constraints:
- Response length: concise, <= 200 words per answer (unless quoting context)
- Embeddings: chunks 300–500 tokens
- Source citation: chapter name, section, and book URL
- Mode enforcement: SELECTION MODE must ignore all non-selected text

Success criteria:
- Answers fully grounded in provided context
- Zero hallucinations or fabrications
- Correct mode enforcement (BOOK vs SELECTION)
- All chats logged and traceable for audit
- Judges can verify answers against original book content

## Response snapshot

Created a new constitution file for the Integrated RAG Chatbot project with the following key elements:

1. Core Principles:
   - Accuracy: Answers must be grounded in book content
   - Non-hallucination: No fabrication of information
   - Clarity: Understandable for all users
   - Traceability: Source citations required
   - Security & Safety: Responsible data handling
   - RAG Modes: BOOK MODE vs SELECTION MODE enforcement

2. Key Standards & Constraints:
   - RAG Implementation with specific modes
   - Response requirements (length limits)
   - Tech stack specifications
   - Refusal rule implementation

3. Success Criteria and Governance sections

The constitution was created with version 1.0.0, ratified on 2025-12-16, with a sync impact report noting pending template updates.

## Outcome

- ✅ Impact: New constitution file created for RAG chatbot project
- 🧪 Tests: No tests required for constitution creation
- 📁 Files: .specify/memory/constitution.md created successfully
- 🔁 Next prompts: Project can now proceed with spec and plan creation
- 🧠 Reflection: Constitution aligns well with RAG chatbot requirements and non-hallucination principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with feature specification