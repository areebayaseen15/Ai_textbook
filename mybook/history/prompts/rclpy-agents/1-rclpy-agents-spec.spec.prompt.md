---
# PHR: rclpy-agents-spec

**ID**: 1
**TITLE**: rclpy-agents-spec
**STAGE**: spec
**DATE_ISO**: 2025-12-06
**SURFACE**: agent
**MODEL**: claude-sonnet-4-5-20250929
**FEATURE**: rclpy-agents
**BRANCH**: 1-rclpy-agents
**USER**: claude

**COMMAND**: /sp.specify

**LABELS**: ["specification", "rclpy", "python", "ros2", "textbook"]

**FILES**:
 - specs/1-rclpy-agents/spec.md
 - specs/1-rclpy-agents/checklists/requirements.md

**TESTS**:
 - spec_validation
 - requirements_checklist

**LINKS**:
 SPEC: specs/1-rclpy-agents/spec.md
 TICKET: null
 ADR: null
 PR: null
---

## PROMPT_TEXT

/sp.specify

## Context
You are generating a **specification** for:

**Book Title:** Physical AI & Humanoid Robotics — An AI-Native Textbook for Panaversity
**Module:** 1 — The Robotic Nervous System (ROS 2)
**Chapter:** 3 — Python Agents with rclpy

**Reference Files:**
- `book-structure.md` for module/chapter blueprint
- `/sp.constitution` for principles and development workflow

**Audience:** Graduate-level robotics/AI students with basic Python knowledge.
**Tone:** Technical, engineering-focused, clean, precise.
**Format:** Markdown/MDX

**Chunking:** Each section/sub-section = one RAG-friendly chunk.

## Goals
- Generate a **detailed chapter specification** for Chapter 3 including:
  - Section & sub-section headings
  - Key technical points
  - Python examples with `rclpy` usage
  - Diagram placeholders
  - Recommended exercises
  - Cross-references to Chapter 2 (Nodes, Topics, Services, Actions)
- Chapter must be split into **sub-chapters**:
  1. `Chapter3-01-NodeCreation.md` – Creating Python ROS 2 nodes
  2. `Chapter3-02-PublishSubscribe.md` – Implementing topics in Python
  3. `Chapter3-03-Services.md` – Python service clients and servers
  4. `Chapter3-04-Actions.md` – Python action clients and servers
- Keep content concise, token-efficient, and suitable for RAG indexing.

## Instructions
1. Use `book-structure.md` to guide headings and sub-headings.
2. Include **all necessary sub-chapters** and sections.
3. Provide placeholders for diagrams (e.g., `<!-- DIAGRAM: Python Node Flow -->`)
4. Specify **Python code snippets** where applicable (`rclpy` examples).
5. Mark sections for RAG-friendly chunking:
   `<!-- CHUNK START: Section X --> ... <!-- CHUNK END: Section X -->`
6. Provide key terms for RAG indexing per section.
7. Include recommended exercises with learning objectives.
8. Keep all specifications **clear, concise, and technical** to minimize token usage.

## Output
- Specification in Markdown for **full Chapter 3**
- List of **sub-chapters** with sections, sub-sections, exercises, diagrams, and key terms
- Ready to use for `/sp.plan` and `/sp.implement`

## RESPONSE_TEXT

Created a comprehensive specification for Chapter 3 - Python Agents with rclpy for the Physical AI & Humanoid Robotics textbook. The specification includes:

- User scenarios and testing for all four sub-chapters (Node Creation, Publish-Subscribe, Services, Actions)
- Functional requirements covering all aspects of rclpy implementation
- Key entities related to ROS 2 Python development
- Measurable success criteria for student learning outcomes
- A quality checklist to validate the specification

The specification addresses the needs of graduate-level robotics/AI students learning Python-based ROS 2 development with rclpy, focusing on practical implementation of nodes, topics, services, and actions.

## OUTCOME

Specification successfully created at specs/1-rclpy-agents/spec.md with supporting checklist at specs/1-rclpy-agents/checklists/requirements.md. Ready for planning phase with /sp.plan.

## EVALUATION

The specification meets all requirements with clear user stories, testable requirements, and measurable success criteria. All content is structured for RAG-friendly chunking and appropriate for the target audience.