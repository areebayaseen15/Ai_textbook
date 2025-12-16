# Data Model: Integrated RAG Chatbot for Physical AI & Humanoid Robotics Book

**Feature**: 1-rag-chatbot-book
**Date**: 2025-12-16

## Entity: Question

**Description**: Represents a user's query submitted to the RAG system

**Fields**:
- `id` (UUID): Unique identifier for the question
- `content` (String, required): The text of the user's question
- `mode` (Enum: BOOK|SELECTION, required): The RAG mode to use for this query
- `selected_text` (String, optional): Text provided by user for SELECTION MODE
- `timestamp` (DateTime, required, default: now): When the question was submitted
- `user_context` (JSON, optional): Additional context about the user's session

**Validation Rules**:
- `content` must not be empty
- `mode` must be one of the allowed values
- In SELECTION MODE, `selected_text` must be provided
- `timestamp` is automatically set on creation

**Relationships**:
- One-to-many with Response (one question can have one response)

## Entity: Response

**Description**: Represents the system's answer to a user's question

**Fields**:
- `id` (UUID): Unique identifier for the response
- `content` (String, required): The text of the system's answer
- `citations` (JSON, optional): References to source chapters/sections/URLs
- `confidence` (Float, optional): Confidence score for the response (0-1)
- `source_passages` (JSON, optional): The passages from which the answer was derived
- `question_id` (UUID, required): Foreign key linking to the question
- `timestamp` (DateTime, required, default: now): When the response was generated

**Validation Rules**:
- `content` must not be empty
- `confidence` must be between 0 and 1 if provided
- `question_id` must reference an existing question
- `content` length must be <= 200 words unless quoting context

**Relationships**:
- Many-to-one with Question (response belongs to one question)

## Entity: TextSelection

**Description**: Represents user-highlighted text used for SELECTION MODE queries

**Fields**:
- `id` (UUID): Unique identifier for the text selection
- `content` (String, required): The selected text content
- `start_position` (Integer, optional): Starting character position in source
- `end_position` (Integer, optional): Ending character position in source
- `chapter_reference` (String, optional): Chapter/section identifier from source
- `page_reference` (String, optional): Page number if applicable
- `timestamp` (DateTime, required, default: now): When the selection was made

**Validation Rules**:
- `content` must not be empty
- If `start_position` is provided, `end_position` must also be provided and be greater
- `content` length should be reasonable (not extremely long)

**Relationships**:
- Used within Question entities (not directly linked)

## Entity: ChatLog

**Description**: Record of user interactions stored for audit purposes

**Fields**:
- `id` (UUID): Unique identifier for the log entry
- `question_content` (String, required): The original question text
- `response_content` (String, required): The system's response text
- `mode` (Enum: BOOK|SELECTION, required): The mode used for this interaction
- `timestamp` (DateTime, required, default: now): When the interaction occurred
- `user_id` (String, optional): Identifier for the user (if available)
- `session_id` (String, optional): Identifier for the conversation session
- `citations` (JSON, optional): Citations included in the response
- `response_time_ms` (Integer, optional): Time taken to generate the response

**Validation Rules**:
- `question_content` and `response_content` must not be empty
- `mode` must be one of the allowed values
- `timestamp` is automatically set on creation

**Relationships**:
- Independent audit trail entity

## Entity: BookContent

**Description**: Represents the book content that has been processed for RAG

**Fields**:
- `id` (UUID): Unique identifier for the content chunk
- `content` (String, required): The text content of this chunk
- `chunk_index` (Integer, required): Position of this chunk in the book
- `chapter` (String, required): Chapter name/identifier
- `section` (String, optional): Section name/identifier
- `url` (String, required): URL reference to the content source
- `vector_id` (String, required): ID in the vector database
- `token_count` (Integer, required): Number of tokens in this chunk
- `created_at` (DateTime, required, default: now): When the chunk was created

**Validation Rules**:
- `content` must not be empty
- `chunk_index` must be non-negative
- `chapter` must not be empty
- `url` must be a valid URL
- `vector_id` must not be empty
- `token_count` must be positive
- Content must be between 300-500 tokens

**Relationships**:
- Used as source for RAG responses (no direct relationship with other entities)

## State Transitions

### Question → Response
- A Question entity is created when a user submits a query
- The RAG service processes the question and creates a corresponding Response entity
- The Response is linked to the Question via the `question_id` foreign key

## Data Flow

1. User submits a Question with content and mode
2. If SELECTION MODE, the system processes the `selected_text` directly
3. If BOOK MODE, the system queries the BookContent via vector database
4. The system generates a Response with citations
5. A ChatLog entry is created to record the interaction for audit