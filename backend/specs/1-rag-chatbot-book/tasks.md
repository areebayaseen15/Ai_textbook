---
description: "Task list for RAG Chatbot implementation"
---

# Tasks: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

**Input**: Design documents from `/specs/1-rag-chatbot-book/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend directory structure per implementation plan
- [ ] T002 Initialize Python project with requirements.txt for FastAPI, Qdrant, Cohere, SQLAlchemy
- [ ] T003 [P] Configure .env file with Qdrant, Cohere, and Neon Postgres credentials

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database models per data-model.md in backend/src/models/
- [ ] T005 [P] Configure Qdrant client connection in backend/src/config/
- [ ] T006 [P] Setup database connection with Neon Postgres in backend/src/config/
- [ ] T007 Create base models (Question, Response, TextSelection, ChatLog) in backend/src/models/
- [ ] T008 Configure logging and error handling infrastructure in backend/src/utils/
- [ ] T009 Setup environment configuration management in backend/src/config/settings.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Ask Questions from Full Book (Priority: P1) 🎯 MVP

**Goal**: Users can ask questions about the Physical AI & Humanoid Robotics book content and receive accurate answers based on the entire book.

**Independent Test**: Can be fully tested by asking various questions about the book content and verifying the answers are accurate and grounded in the book.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for chat endpoint in backend/tests/contract/test_chat.py
- [ ] T011 [P] [US1] Integration test for book content query in backend/tests/integration/test_book_query.py

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create BookContent model in backend/src/models/book_content.py
- [ ] T013 [P] [US1] Create ingestion service in backend/src/services/ingestion_service.py
- [ ] T014 [US1] Implement Qdrant service for vector operations in backend/src/services/qdrant_service.py
- [ ] T015 [US1] Implement RAG service for BOOK MODE in backend/src/services/rag_service.py
- [ ] T016 [US1] Create chat API endpoint in backend/src/api/routes/chat.py
- [ ] T017 [US1] Add BOOK MODE logic with vector search in backend/src/services/rag_service.py
- [ ] T018 [US1] Add citation extraction for book content in backend/src/services/rag_service.py
- [ ] T019 [US1] Add response length limiting to <=200 words in backend/src/services/rag_service.py
- [ ] T020 [US1] Add logging to Neon Postgres for chat interactions in backend/src/services/logging_service.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Ask Questions from Selected Text (Priority: P2)

**Goal**: Users can highlight or select specific text and ask questions that are answered only from that selected text, ignoring the broader book content.

**Independent Test**: Can be tested by selecting specific text, asking questions related to that text, and verifying answers only come from the selected content.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Contract test for selection mode endpoint in backend/tests/contract/test_selection.py
- [ ] T022 [P] [US2] Integration test for selected text query in backend/tests/integration/test_selection_query.py

### Implementation for User Story 2

- [ ] T023 [P] [US2] Enhance RAG service to support SELECTION MODE in backend/src/services/rag_service.py
- [ ] T024 [US2] Implement text processing for user selections in backend/src/utils/text_processor.py
- [ ] T025 [US2] Add SELECTION MODE validation to prevent vector DB access in backend/src/services/rag_service.py
- [ ] T026 [US2] Update chat endpoint to handle selected text input in backend/src/api/routes/chat.py
- [ ] T027 [US2] Implement refusal response when no relevant content exists in backend/src/services/rag_service.py
- [ ] T028 [US2] Add SELECTION MODE logging to Neon Postgres in backend/src/services/logging_service.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mode Verification and Citations (Priority: P3)

**Goal**: Users can verify the mode of operation and see proper citations for the information provided.

**Independent Test**: Can be tested by checking that responses include proper citations and that mode enforcement is working correctly.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T029 [P] [US3] Contract test for citation endpoint in backend/tests/contract/test_citations.py
- [ ] T030 [P] [US3] Integration test for mode switching in backend/tests/integration/test_mode_switching.py

### Implementation for User Story 3

- [ ] T031 [P] [US3] Enhance citation extraction with chapter/section info in backend/src/services/rag_service.py
- [ ] T032 [US3] Add mode verification API endpoint in backend/src/api/routes/verification.py
- [ ] T033 [US3] Implement mode switching validation in backend/src/services/rag_service.py
- [ ] T034 [US3] Add response schema to include citations in backend/src/api/schemas/response.py
- [ ] T035 [US3] Create audit verification tools for judges in backend/src/utils/audit_tools.py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Documentation updates in backend/docs/
- [ ] T037 Code cleanup and refactoring
- [ ] T038 Performance optimization across all stories
- [ ] T039 [P] Additional unit tests (if requested) in backend/tests/unit/
- [ ] T040 Security hardening
- [ ] T041 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for chat endpoint in backend/tests/contract/test_chat.py"
Task: "Integration test for book content query in backend/tests/integration/test_book_query.py"

# Launch all models for User Story 1 together:
Task: "Create BookContent model in backend/src/models/book_content.py"
Task: "Create ingestion service in backend/src/services/ingestion_service.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence