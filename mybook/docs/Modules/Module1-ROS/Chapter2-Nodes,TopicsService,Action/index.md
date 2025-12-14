---
id: index
title: Chapter 2 - Overview
sidebar_label: Chapter 2 Overview
sidebar_position: 4
---

# Chapter 2: Overview

This chapter provides a comprehensive exploration of ROS 2 core communication primitives: Nodes, Topics, Services, and Actions. We will examine the underlying communication patterns including publish/subscribe, request/response, and goal/feedback/result with practical examples. The content includes comprehensive Python code snippets using `rclpy` to demonstrate the implementation of each concept. All content is optimally chunked for RAG (Retrieval-Augmented Generation) ingestion, with each major concept forming a distinct chunk. The examples adhere strictly to ROS 2 Humble conventions.

## Learning Objectives

- Understand and implement ROS 2 nodes with proper lifecycle management
- Create publishers and subscribers for asynchronous communication
- Implement service servers and clients for synchronous communication
- Design action servers and clients for long-running tasks with feedback
- Apply Quality of Service (QoS) policies appropriately
- Define and use custom message, service, and action types

## 2.1 ROS 2 Nodes: The Computational Units

### Key Concepts
- **ROS 2 Node**: An executable process that performs computation within the ROS 2 system
- **`rclpy.init()`**: Initializes the ROS 2 client library
- **`rclpy.create_node()`**: Creates a new ROS 2 node instance
- **`rclpy.spin()`**: Keeps the node alive and processes callbacks
- **`rclpy.shutdown()`**: Shuts down the ROS 2 client library

### Basic Node Implementation

```python
import rclpy
from rclpy.node import Node

class MinimalNode(Node):
    def __init__(self):
        super().__init__('minimal_node')
        self.get_logger().info('Minimal Node initialized.')

def main(args=None):
    rclpy.init(args=args)
    node = MinimalNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        node.get_logger().info('Minimal Node shutting down.')
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 2.2 Topics: Asynchronous Data Streaming (Publish/Subscribe)

### Key Concepts
- **ROS 2 Topics**: Named buses for passing messages between nodes
- **Publisher**: Node that sends messages to a topic
- **Subscriber**: Node that receives messages from a topic
- **Publish/Subscribe Pattern**: Asynchronous communication model

### Basic Publisher Implementation

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello ROS 2: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 2.3 Services: Synchronous Request/Response

### Key Concepts
- **ROS 2 Services**: Synchronous request/response communication pattern
- **Service Server**: Node that provides a service
- **Service Client**: Node that requests a service
- **Request/Response Pattern**: Synchronous communication model

### Basic Service Server Implementation

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts # Standard service type

class MinimalService(Node):
    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)
        self.get_logger().info('Add Two Ints Service Ready.')

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'Incoming request: a={request.a}, b={request.b}, sum={response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    minimal_service = MinimalService()
    rclpy.spin(minimal_service)
    minimal_service.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 2.4 Actions: Asynchronous Goal-Oriented Tasks

### Key Concepts
- **ROS 2 Actions**: Asynchronous goal/feedback/result communication pattern
- **Action Server**: Node that executes long-running tasks
- **Action Client**: Node that sends goals and receives feedback/results
- **Goal**: Request sent to an action server
- **Feedback**: Periodic updates during task execution
- **Result**: Final outcome of the task

### Basic Action Server Implementation

```python
import rclpy
from rclpy.action import ActionServer, ActionClient, CancelResponse, GoalResponse
from rclpy.node import Node
from rclpy.callback_groups import ReentrantCallbackGroup
from rclpy.executors import MultiThreadedExecutor

# Assuming custom action type in my_robot_controller/action/Fibonacci.action
# int32 order
# ---
# int32[] sequence
# ---
# int32[] partial_sequence
from my_robot_controller.action import Fibonacci # Import custom action

import time

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback,
            goal_callback=self.goal_callback,
            handle_accepted_callback=self.handle_accepted_callback,
            cancel_callback=self.cancel_callback,
            callback_group=ReentrantCallbackGroup() # Use reentrant group for concurrent callbacks
        )
        self.get_logger().info('Fibonacci Action Server Ready.')

    def goal_callback(self, goal_request):
        self.get_logger().info(f'Received goal request with order {goal_request.order}')
        # Validate goal request
        if goal_request.order > 1000: # Example validation
            self.get_logger().warn('Goal order too high, rejecting.')
            return GoalResponse.REJECT
        return GoalResponse.ACCEPT

    def handle_accepted_callback(self, goal_handle):
        self.get_logger().info('Goal accepted, executing...')
        # Start a new thread for execution to avoid blocking the main executor
        # In a real robot, this would offload to a control loop
        import threading
        thread = threading.Thread(target=self.execute_callback, args=(goal_handle,))
        thread.start()

    def cancel_callback(self, goal_handle):
        self.get_logger().info('Received cancel request')
        # Implement logic to stop the long-running task if possible
        return CancelResponse.ACCEPT

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')
        feedback_msg = Fibonacci.Feedback()
        feedback_msg.partial_sequence = [0, 1]

        # Fibonacci sequence generation
        for i in range(1, goal_handle.request.order):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled by client.')
                return Fibonacci.Result()

            feedback_msg.partial_sequence.append(
                feedback_msg.partial_sequence[i] + feedback_msg.partial_sequence[i-1]
            )
            self.get_logger().info(f'Feedback: {feedback_msg.partial_sequence[-1]}')
            goal_handle.publish_feedback(feedback_msg)
            time.sleep(0.5) # Simulate work

        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.partial_sequence
        self.get_logger().info('Goal succeeded.')
        return result

def main(args=None):
    rclpy.init(args=args)
    executor = MultiThreadedExecutor()
    action_server_node = FibonacciActionServer()
    executor.add_node(action_server_node)

    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        executor.shutdown()
        action_server_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Recommended Exercises

### Exercise 2.1: ROS 2 Talker-Listener with Custom Message and QoS
- **Task:** Create a custom message type (e.g., `RobotPose` with `float32 x, y, theta`). Implement a Python publisher that sends `RobotPose` messages and a Python subscriber that receives and logs them. Experiment with different QoS settings (e.g., `ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE` vs. `ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_BEST_EFFORT`) and observe their impact on message delivery under simulated lossy conditions.

### Exercise 2.2: Simple Robot Control Service
- **Task:** Define a custom service (`SetSpeed.srv` with a `float32 speed` request and a `bool success` response). Implement a Python service server that accepts a speed command and simply logs it, returning `True`. Implement a Python service client that sends speed requests and prints the success status.

### Exercise 2.3: "Move to Goal" Action with Cancellation
- **Task:** Define a custom action (`MoveToGoal.action` with `float32 target_x, target_y` as goal, `bool success, float32 final_x, float32 final_y` as result, and `float32 current_x, float32 current_y, float32 distance_to_goal` as feedback). Implement a Python action server that simulates moving to the goal, sends continuous feedback, and allows for preemption/cancellation. Implement a Python action client that sends a goal, displays feedback, and demonstrates how to send a cancellation request.
