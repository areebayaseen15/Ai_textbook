# Feature Specification: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

**Feature Branch**: `1-rag-chatbot-book`  
**Created**: 2025-12-16  
**Status**: Draft  

**Input**: User description: "Project: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

Target audience: Hackathon judges and technical users of the book

Focus:
- Answer user questions about the book content
- Support both full-book retrieval and user-selected-text retrieval
- Ensure answers are grounded in context and traceable

Book content source:
- Use the deployed book on Vercel for embedding and ingestion:  
  [https://ai-textbook-orcin.vercel.app/](https://ai-textbook-orcin.vercel.app/)

Success criteria:
- Correctly retrieves and answers questions from the book content
- Honors SELECTION MODE (answer only from highlighted text)
- Zero hallucinations or fabricated responses
- Mode enforcement verified (BOOK vs SELECTION)
- Citations/reference to chapter, section, or URL included when possible
- Chat logs stored for audit
- Judges can verify answers against original book content

Constraints:
- Answer length: concise, <=200 words unless quoting context
- Chunk size: 300–500 tokens for processing
- Observability: log user question, mode, timestamp
- Refusal: respond "The answer is not found in the selected text." if no relevant content

Not building:
- Answering outside book content or selected text
- General AI discussion unrelated to the book
- Full research reports or external citations
- Implementation guides beyond RAG integration"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask Questions from Full Book (Priority: P1)

Users can ask questions about the Physical AI & Humanoid Robotics book content and receive accurate answers based on the entire book.

**Why this priority**: This is the core functionality that enables users to get information from the entire book content.

**Independent Test**: Can be fully tested by asking various questions about the book content and verifying the answers are accurate and grounded in the book.

**Acceptance Scenarios**:

1. **Given** a user has access to the RAG chatbot, **When** user asks a question about book content, **Then** the system retrieves relevant passages from the book and provides an accurate answer based on those passages  
2. **Given** a user asks a question with no relevant content in the book, **When** the system processes the query, **Then** the system responds with "The answer is not found in the selected text."

---

### User Story 2 - Ask Questions from Selected Text (Priority: P2)

Users can highlight or select specific text and ask questions that are answered only from that selected text, ignoring the broader book content.

**Why this priority**: This provides the SELECTION MODE functionality which is a key differentiator of the system.

**Independent Test**: Can be tested by selecting specific text, asking questions related to that text, and verifying answers only come from the selected content.

**Acceptance Scenarios**:

1. **Given** a user has selected specific text from the book, **When** user asks a question related to the selection, **Then** the system provides an answer based only on the selected text  
2. **Given** a user has selected specific text from the book, **When** user asks a question not covered by the selection, **Then** the system responds with "The answer is not found in the selected text."

---

### User Story 3 - Mode Verification and Citations (Priority: P3)

Users can verify the mode of operation and see proper citations for the information provided.

**Why this priority**: This ensures transparency and verifiability which are important for judges and technical users.

**Independent Test**: Can be tested by checking that responses include proper citations and that mode enforcement is working correctly.

**Acceptance Scenarios**:

1. **Given** a user receives an answer from the system, **When** they examine the response, **Then** the response includes citations to specific chapters, sections, or URLs from the book  
2. **Given** a user switches between BOOK MODE and SELECTION MODE, **When** they ask the same question in each mode, **Then** the system behaves differently based on the active mode

---

### Edge Cases

- What happens when a user switches between modes during a conversation?  
- How does the system handle very long text selections?  
- What happens when selected text is modified while a question is being processed?  
- How does the system handle queries in different languages?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST answer user questions based only on the Physical AI & Humanoid Robotics book content (from Vercel URL)  
- **FR-002**: System MUST support two modes: BOOK MODE (full book retrieval) and SELECTION MODE (selected text only)  
- **FR-003**: System MUST NOT fabricate information or hallucinate responses  
- **FR-004**: System MUST respond with "The answer is not found in the selected text." when no relevant content exists  
- **FR-005**: System MUST provide citations to specific chapters, sections, or URLs when possible  
- **FR-006**: System MUST log all user questions, selected mode, and timestamps  
- **FR-007**: System MUST enforce SELECTION MODE by ignoring content outside the user-selected text  
- **FR-008**: System MUST limit answers to 200 words unless quoting context directly  
- **FR-009**: System MUST process text selections of 300-500 token chunks for embedding

### Key Entities *(include if feature involves data)*

- **Question**: User query submitted to the system, containing the text of the question and metadata (timestamp, mode, user context)  
- **Response**: System output containing the answer, citations, and metadata (confidence, source passages)  
- **TextSelection**: User-highlighted text that serves as the context for SELECTION MODE queries  
- **ChatLog**: Record of user interactions stored for audit purposes

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of responses are grounded in Physical AI & Humanoid Robotics book content (Vercel URL) with no hallucinations  
- **SC-002**: 100% of SELECTION MODE queries answer only from user-selected text, ignoring broader book content  
- **SC-003**: 95% of responses include proper citations to chapters, sections, or URLs when relevant content exists  
- **SC-004**: 100% of queries with no relevant content trigger the "The answer is not found in the selected text." response  
- **SC-005**: All user interactions (questions, mode, timestamps) are logged for audit  
- **SC-006**: Judges can independently verify 100% of answers against original book content  
- **SC-007**: Answers are concise with 95% under 200 words unless quoting context directly
