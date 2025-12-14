# Implementation Plan: Initialize Docusaurus Book Project Scaffold

**Branch**: `1-docusaurus-init` | **Date**: 2025-12-04 | **Spec**: [specs/1-docusaurus-init/spec.md](specs/1-docusaurus-init/spec.md)
**Input**: Feature specification from `/specs/1-docusaurus-init/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the steps to initialize a foundational Docusaurus project scaffold for the "Physical AI & Humanoid Robotics Textbook". The technical approach involves using the Docusaurus CLI for initial setup, configuring basic project metadata, preparing directory structures for future content generation and skill integration (RAG chatbot, personalization, translation), and establishing a robust Git repository scaffold with relevant guidelines.

## Technical Context

**Language/Version**: Node.js (latest LTS for Docusaurus), Python 3.11+ (for FastAPI backend/skills)
**Primary Dependencies**: Docusaurus, npm/yarn, FastAPI, Qdrant client, psycopg2-binary (for NeonDB)
**Storage**: NeonDB (for RAG metadata, user profiles), Qdrant (for vector embeddings), local filesystem (for Docusaurus content)
**Testing**: Jest/React Testing Library (for Docusaurus components), Pytest (for FastAPI/Python skills)
**Target Platform**: Web (Docusaurus served via Node.js), Backend (FastAPI served via Python)
**Project Type**: Hybrid (web frontend + Python backend)
**Performance Goals**: Docusaurus site load time < 2s; RAG chatbot response time < 3s (initial scaffold has minimal performance burden, but future features will need to meet these)
**Constraints**: Adherence to Docusaurus best practices, modular skill integration, no hardcoded secrets, prepare for automation-first development.
**Scale/Scope**: Educational textbook for a medium-sized audience, scalable RAG for growing content.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

-   **I. Spec-Driven Content Creation:** This plan is directly derived from the `specs/1-docusaurus-init/spec.md` (Pass).
-   **II. AI-Native Automation First:** The plan explicitly sets up the project to facilitate automation via Claude Code agents and skills (Pass).
-   **III. Modular & Single-Responsibility Skills:** The project structure and future content hooks are designed to integrate modular skills, not hardcode functionalities (Pass).
-   **IV. User-Centric Personalization & Accessibility:** The plan includes placeholders and hooks for future personalization and translation features (Pass).
-   **V. Integrated RAG Chatbot:** The plan dedicates specific directories (`api/`, `src/components/Chatbot/`) for the RAG chatbot's backend and frontend components (Pass).
-   **VI. Test-Driven Development (TDD) for Implementations:** The plan acknowledges the need for testing frameworks for future code generation and integration (Pass).

## Project Structure

### Documentation (this feature)

```text
specs/1-docusaurus-init/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (N/A for this scaffold)
├── data-model.md        # Phase 1 output (Conceptual for this scaffold)
├── quickstart.md        # Phase 1 output (Basic setup steps)
├── contracts/           # Phase 1 output (Placeholder for future APIs)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
.
├── .claude/
│   └── skills/           # All Claude Code skills (existing)
├── api/                  # FastAPI backend for RAG, Auth, Personalization, Translation
│   ├── __init__.py
│   ├── main.py           # FastAPI app entry point (minimal setup)
│   ├── routers/          # Placeholder for API endpoint modules
│   ├── services/         # Placeholder for Qdrant, NeonDB, OpenAI integrations
│   └── .env.example      # Environment variables for API configuration
├── docs/                 # Docusaurus markdown content (empty, ready for chapters)
├── src/                  # Docusaurus custom components, pages
│   ├── components/       # Placeholder for Chatbot UI, Personalization, Translation buttons
│   ├── pages/
│   └── css/
├── static/               # Docusaurus static assets (empty)
├── blog/                 # Docusaurus blog content (default, minimal)
├── docusaurus.config.js  # Main Docusaurus configuration (initial values)
├── sidebars.js           # Docusaurus navigation sidebar (initial values)
├── package.json          # Node.js dependencies for Docusaurus
├── yarn.lock / package-lock.json  # Dependency lock file
├── .gitignore            # Standard Git ignore for Node/Python/Docusaurus
├── README.md             # Project overview and guidelines
├── tsconfig.json         # Docusaurus TypeScript config (if `create-docusaurus` installs TS template)
└── tailwind.config.js    # Placeholder if TailwindCSS is later added
```

**Structure Decision**: A hybrid monorepo-like structure is selected, integrating Docusaurus at the repository root for the frontend, a dedicated `api/` directory for the Python/FastAPI backend, and the existing `.claude/skills/` for agent skills. This promotes clear separation of concerns, maintainability, and extensibility for future features. The `docs/` and `src/components/` directories are specifically prepared as future content hooks for skill-generated output.

## Phase 0: Research

*N/A for this task. Requirements for scaffolding are clear and no critical unknowns require prior research.*

## Phase 1: Design & Contracts

### Data Model (Conceptual for Scaffolding)

For the initial scaffold, no complex application-level data models are directly implemented. However, the project anticipates the following core entities for future phases, which will reside in NeonDB:

-   **User**: Represents a learner on the platform. Key attributes will include `user_id`, `username`, `email`, `password_hash`, `learning_profile` (JSON for personalization preferences).
-   **Chapter**: Represents a textbook chapter. Key attributes will include `chapter_id`, `title`, `content_path` (link to Docusaurus markdown), `version`, `tags`.
-   **Question/Answer**: For RAG chatbot interaction. Key attributes will include `q-id`, `user_query`, `chatbot_response`, `timestamp`, `chapter_context_id`.
-   **Translation**: Stores translated content or links to it. Key attributes will include `translation_id`, `chapter_id`, `language`, `translated_content_path`.

### API Contracts (Placeholder)

For the initial scaffold, no concrete API contracts are defined beyond the conceptual existence of a FastAPI backend. Future API contracts will emerge from specific feature specifications (e.g., for user authentication, RAG queries, personalization, translation) and will be documented in `contracts/`.

### Quickstart Guide (Initial Draft for `quickstart.md`)

```markdown
# Quickstart: Physical AI & Humanoid Robotics Textbook Project

This guide provides instructions to get the Docusaurus book project and its associated backend services running locally.

## 1. Prerequisites
-   Node.js (LTS version, e.g., v18.x or v20.x)
-   npm or Yarn
-   Python 3.11+
-   Docker (for Qdrant, NeonDB)

## 2. Project Setup

### a. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

### b. Docusaurus Frontend Setup
```bash
npm install  # or yarn install
npm start    # or yarn start
```
This will start the Docusaurus development server at `http://localhost:3000`.

### c. FastAPI Backend Setup (Conceptual)
*(Details for specific services will be added as they are implemented.)*

1.  **Create Python Virtual Environment**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    ```
2.  **Install Dependencies**
    ```bash
    pip install -r api/requirements.txt # Placeholder: requires api/requirements.txt
    ```
3.  **Environment Variables**
    Copy `.env.example` to `.env` in the `api/` directory and fill in necessary values.

4.  **Run FastAPI (Conceptual)**
    ```bash
    cd api
    uvicorn main:app --reload
    ```
    (Requires `uvicorn` and `main.py` to be set up.)

## 3. Skill Integration

Claude Code skills are located in the `.claude/skills/` directory. They can be invoked by the Claude Code agent to automate various tasks, from content generation to system building.

```

### Agent Context Update (Implicit for this plan)

This planning phase identifies `Docusaurus`, `Node.js`, `npm/yarn`, `FastAPI`, `Python`, `Qdrant`, `NeonDB` as key technologies. These will be used to update the agent's context for future planning and implementation phases.
