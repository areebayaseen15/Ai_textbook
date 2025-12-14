# Data Model: Python Agents with rclpy

## Core Entities

### Python ROS 2 Node
- **Name**: The identifier for the node
- **Publishers**: Collection of topic publishers
- **Subscribers**: Collection of topic subscribers
- **Services**: Collection of service servers
- **Service Clients**: Collection of service clients
- **Actions**: Collection of action servers
- **Action Clients**: Collection of action clients
- **Parameters**: Configuration parameters
- **Logger**: Logging interface
- **Clock**: Time management interface

### ROS Message
- **Type**: Message type identifier (e.g., std_msgs/String, sensor_msgs/LaserScan)
- **Data**: Message content
- **Timestamp**: Message creation time
- **Header**: Metadata (frame_id, sequence number)

### Topic
- **Name**: Topic identifier
- **Type**: Message type
- **QoS Profile**: Quality of Service settings
- **Publisher Count**: Number of publishers
- **Subscriber Count**: Number of subscribers

### Service
- **Name**: Service identifier
- **Request Type**: Request message type
- **Response Type**: Response message type
- **QoS Profile**: Quality of Service settings

### Action
- **Name**: Action identifier
- **Goal Type**: Goal message type
- **Feedback Type**: Feedback message type
- **Result Type**: Result message type
- **Status**: Current action status

## Relationships

- **Node** 1..* **Publisher**: A node can have multiple publishers
- **Node** 1..* **Subscriber**: A node can have multiple subscribers
- **Node** 1..* **Service Server**: A node can provide multiple services
- **Node** 1..* **Service Client**: A node can use multiple services
- **Node** 1..* **Action Server**: A node can provide multiple actions
- **Node** 1..* **Action Client**: A node can use multiple actions
- **Publisher** 1..1 **Topic**: Each publisher sends to one topic
- **Subscriber** 1..1 **Topic**: Each subscriber receives from one topic

## State Transitions

### Node Lifecycle States
- **Unconfigured** → **Inactive**: After configuration
- **Inactive** → **Active**: After activation
- **Active** → **Inactive**: After deactivation
- **Inactive** → **Finalized**: After cleanup

### Action States
- **PENDING** → **ACTIVE**: When goal is accepted
- **ACTIVE** → **FEEDBACK**: During execution with feedback
- **ACTIVE** → **SUCCEEDED**: When goal completes successfully
- **ACTIVE** → **CANCELED**: When goal is canceled
- **ACTIVE** → **ABORTED**: When goal execution fails

## Validation Rules

### From Functional Requirements
- **FR-001**: Each Python ROS 2 node must initialize properly using rclpy
- **FR-002**: Publishers must send messages to topics without blocking
- **FR-003**: Subscribers must handle incoming messages asynchronously
- **FR-004**: Service clients must handle timeouts appropriately
- **FR-005**: Action clients must handle feedback, goals, and results
- **FR-006**: All code must follow ROS 2 Humble conventions
- **FR-007**: Content must be chunked for RAG indexing (200-500 tokens per chunk)

## Bridge Interface Model

### Python Agent to ROS Controller Bridge
- **Agent Interface**: Python-based AI algorithm interface
- **Bridge Layer**: Translation layer between Python agent and ROS
- **ROS Interface**: Standard ROS 2 communication patterns
- **Command Queue**: Buffer for outgoing commands to controllers
- **Feedback Buffer**: Buffer for incoming sensor data from controllers
- **Synchronization Mechanism**: Coordination between agent and controller timing

This bridge model enables Python-based AI agents to interact with ROS-based robot controllers while maintaining proper separation of concerns and communication patterns.