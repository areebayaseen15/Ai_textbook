# Chapter 2 Specification: Nodes, Topics, Services, and Actions

## Context
This specification outlines the content for Chapter 2, "Nodes, Topics, Services, and Actions," part of Module 1, "The Robotic Nervous System (ROS 2)," in the textbook "Physical AI & Humanoid Robotics — An AI-Native Textbook for Panaversity." The book structure is defined in `.specify/memory/book_structure.md`.

**Audience:** Graduate-level students in robotics and AI with basic Python knowledge.
**Tone:** Technical, engineering-focused, clean, and precise, following ai-native.panaversity.org style.

## Goals
- Provide a deep dive into ROS 2 core communication primitives: Nodes, Topics, Services, and Actions.
- Explain the underlying communication patterns (publish/subscribe, request/response, goal/feedback/result) with practical examples.
- Include comprehensive Python code snippets using `rclpy` to demonstrate the implementation of each concept.
- Integrate clear diagram placeholders for illustrating architecture, communication flow, and action sequences.
- Ensure all content is optimally chunked for RAG (Retrieval-Augmented Generation) ingestion, with each major concept forming a distinct chunk.
- Include well-defined recommended exercises and small hands-on examples to reinforce learning.
- Prepare students for developing more complex Python agents in the subsequent chapter.
- Adhere strictly to ROS 2 Humble conventions throughout the chapter.

## Chapter 2: Nodes, Topics, Services, and Actions

### Section 2.1: ROS 2 Nodes: The Computational Units
-   **Learning Objectives:**
    -   Understand the role and lifecycle of a ROS 2 node.
    -   Differentiate between `rclpy.init()`, `rclpy.create_node()`, `rclpy.spin()`, and `rclpy.shutdown()`.
    -   Implement a basic `rclpy` node in Python.
-   **Key Concepts:** ROS 2 Node, `rclpy.init()`, `rclpy.create_node()`, `rclpy.spin()`, `rclpy.shutdown()`, Node Lifecycle.
-   **Code Snippet Placeholders (Python/rclpy):**
    -   `[CODE SNIPPET 2.1.1: Basic rclpy node initialization and simple logging.]`
    -   `[CODE SNIPPET 2.1.2: Node with parameters.]`
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.1.1: Simplified representation of a single ROS 2 node within the ROS 2 graph.]`
-   **RAG Chunking Note:** This section will serve as a foundational RAG chunk for ROS 2 nodes.

### Section 2.2: Topics: Asynchronous Data Streaming (Publish/Subscribe)
-   **Learning Objectives:**
    -   Explain the publish/subscribe communication model.
    -   Implement a Python publisher and subscriber using `rclpy`.
    -   Understand ROS 2 message types and their definition.
    -   Grasp the concept of Quality of Service (QoS) settings for topics.
-   **Key Concepts:** ROS 2 Topics, Publisher, Subscriber, Publish/Subscribe Pattern, Message Types, `std_msgs`, Custom Messages, Quality of Service (QoS), `rclpy.qos.QoSProfile`.
-   **Code Snippet Placeholders (Python/rclpy):**
    -   `[CODE SNIPPET 2.2.1: Simple Python publisher for `std_msgs/String`.]`
    -   `[CODE SNIPPET 2.2.2: Simple Python subscriber for `std_msgs/String`.]`
    -   `[CODE SNIPPET 2.2.3: Example of defining a custom message type (ROS IDL) and using it.]`
    -   `[CODE SNIPPET 2.2.4: Publisher/subscriber with QoS settings.]`
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.2.1: Publish/Subscribe communication flow with multiple publishers and subscribers.]`
    -   `[DIAGRAM 2.2.2: Visualization of a custom message definition structure.]`
-   **RAG Chunking Note:** This section will be a major RAG chunk, further divisible into sub-chunks for Publisher, Subscriber, Message Types, and QoS.

### Section 2.3: Services: Synchronous Request/Response
-   **Learning Objectives:**
    -   Understand the request/response communication model.
    -   Implement a Python service server and client using `rclpy`.
    -   Define service types (ROS IDL) for requests and responses.
-   **Key Concepts:** ROS 2 Services, Service Server, Service Client, Request/Response Pattern, Service Types, Custom Service Definitions.
-   **Code Snippet Placeholders (Python/rclpy):**
    -   `[CODE SNIPPET 2.3.1: Python service server returning a simple response.]`
    -   `[CODE SNIPPET 2.3.2: Python service client making a request and waiting for response.]`
    -   `[CODE SNIPPET 2.3.3: Example of defining a custom service type (ROS IDL).]`
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.3.1: Service client-server interaction flow.]`
-   **RAG Chunking Note:** This section will be a cohesive RAG chunk for ROS 2 services.

### Section 2.4: Actions: Asynchronous Goal-Oriented Tasks
-   **Learning Objectives:**
    -   Explain the goal/feedback/result communication model.
    -   Implement a Python action server and client using `rclpy`.
    -   Define action types (ROS IDL) for goals, feedback, and results.
    -   Manage asynchronous execution and task cancellation.
-   **Key Concepts:** ROS 2 Actions, Action Server, Action Client, Goal, Feedback, Result, Action Types, Asynchronous Tasks, Task Cancellation.
-   **Code Snippet Placeholders (Python/rclpy):**
    -   `[CODE SNIPPET 2.4.1: Python action server processing a goal and sending feedback.]`
    -   `[CODE SNIPPET 2.4.2: Python action client sending a goal and processing feedback/result.]`
    -   `[CODE SNIPPET 2.4.3: Example of defining a custom action type (ROS IDL).]`
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.4.1: Action client-server interaction with goal, feedback, and result flow.]`
    -   `[DIAGRAM 2.4.2: State machine for a typical ROS 2 action.]`
-   **RAG Chunking Note:** This section will be a robust RAG chunk for ROS 2 actions.

## Recommended Python Exercises / Examples
1.  **Exercise 2.1: ROS 2 Talker-Listener with Custom Message:** Create a custom message type (e.g., `RobotPose`) and implement a Python publisher and subscriber that exchange messages of this custom type. Experiment with different QoS settings (e.g., `reliable` vs `best effort`).
2.  **Exercise 2.2: Simple Robot Control Service:** Define a service (e.g., `SetSpeed`) that takes a speed value as a request and returns a success boolean as a response. Implement both a Python service server and client. The server should just log the received speed.
3.  **Exercise 2.3: "Move to Goal" Action:** Implement a simple action client and server. The client sends a goal (e.g., a target position `x, y`). The server simulates movement, sends back periodic feedback (e.g., `current_x, current_y`), and returns a success/failure result upon completion or interruption.

## Cross-References to Future Chapters
-   **Chapter 1 (Introduction to ROS 2 for Physical AI):** This chapter directly builds upon the high-level overview of ROS 2 concepts introduced in Chapter 1.
-   **Chapter 3 (Python Agents with rclpy):** The communication primitives mastered in this chapter are essential building blocks for creating the more complex, intelligent Python agents that will be the focus of Chapter 3.
-   **Module 2 (The Digital Twin - Simulation):** Understanding ROS 2 communication is critical for integrating simulated robots (Gazebo, Unity) with ROS 2 control interfaces.

## Output Structure Notes
-   Each section and sub-section will be clearly demarcated with Markdown headings.
-   Learning objectives, key concepts, code, and diagram placeholders will be explicit.
-   Key terms will be highlighted for RAG optimization.
-   Exercises will be clearly listed with brief descriptions.
