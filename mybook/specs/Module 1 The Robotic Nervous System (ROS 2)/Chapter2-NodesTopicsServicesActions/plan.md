# Chapter 2 Plan: Nodes, Topics, Services, and Actions

## Context
This detailed plan is for Chapter 2, "Nodes, Topics, Services, and Actions," within Module 1, "The Robotic Nervous System (ROS 2)," of the textbook "Physical AI & Humanoid Robotics — An AI-Native Textbook for Panaversity." The content will be RAG-ready, Markdown/MDX friendly, technical, and adhere to an AI-native style.

**Audience:** Graduate-level students in robotics and AI with basic Python knowledge.
**Tone:** Technical, clean, engineering-focused.

## Chapter 2: Nodes, Topics, Services, and Actions

### 2.1 ROS 2 Nodes: The Computational Units
-   **Learning Objectives:**
    -   Understand the role and lifecycle of a ROS 2 node.
    -   Differentiate between `rclpy.init()`, `rclpy.create_node()`, `rclpy.spin()`, and `rclpy.shutdown()`.
    -   Implement a basic `rclpy` node in Python.
    -   Understand how to declare and use node parameters.
-   **Key Concepts:** ROS 2 Node, `rclpy.init()`, `rclpy.create_node()`, `rclpy.spin()`, `rclpy.shutdown()`, Node Lifecycle, Node Naming, Node Parameters (`Node.declare_parameter()`, `Node.get_parameter()`).
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.1.1: Simplified representation of a single ROS 2 node within the ROS 2 graph, showing its internal components (logger, timer, etc.).]`
-   **Python Code Snippet Placeholders (rclpy):**
    -   `[CODE SNIPPET 2.1.1: Minimal Python node with basic logging and lifecycle management.]`
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
    -   `[CODE SNIPPET 2.1.2: Node demonstrating parameter declaration and usage.]`
    ```python
    import rclpy
    from rclpy.node import Node
    from rcl_interfaces.msg import ParameterDescriptor

    class ParameterNode(Node):
        def __init__(self):
            super().__init__('parameter_node')

            # Declare a parameter with a default value and description
            my_parameter_descriptor = ParameterDescriptor(description='This is my custom parameter.')
            self.declare_parameter('my_parameter', 'default_value', my_parameter_descriptor)

            # Get the parameter value
            param_value = self.get_parameter('my_parameter').get_parameter_value().string_value
            self.get_logger().info(f'My parameter value is: {param_value}')

            # Optionally, set a parameter dynamically (demonstrates capability)
            self.set_parameters([rclpy.Parameter('my_parameter', rclpy.Parameter.Type.STRING, 'new_value')])
            new_param_value = self.get_parameter('my_parameter').get_parameter_value().string_value
            self.get_logger().info(f'My parameter value updated to: {new_param_value}')

    def main(args=None):
        rclpy.init(args=args)
        node = ParameterNode()
        try:
            rclpy.spin(node)
        except KeyboardInterrupt:
            pass
        finally:
            node.destroy_node()
            rclpy.shutdown()

    if __name__ == '__main__':
        main()
    ```
-   **Content Notes:** This section will detail the fundamental nature of ROS 2 nodes as independent executables. It will explain the Python `rclpy` API calls for node initialization, creation, running (spinning), and shutdown. Emphasis will be placed on the node lifecycle and robust error handling (e.g., `KeyboardInterrupt`). The concept of node parameters will be introduced with examples of how to declare, set, and retrieve them, highlighting their utility for configurable nodes. The content will reinforce Chapter 1's overview.
-   **RAG Chunking Note:** This section will form a core RAG chunk, focusing exclusively on nodes. Code snippets will be distinct sub-chunks.

### 2.2 Topics: Asynchronous Data Streaming (Publish/Subscribe)
-   **Learning Objectives:**
    -   Explain the asynchronous publish/subscribe communication model in detail.
    -   Implement ROS 2 publishers and subscribers in Python using `rclpy`.
    -   Understand and utilize standard ROS 2 message types (e.g., `std_msgs`).
    -   Learn to define and use custom ROS IDL message types.
    -   Grasp the significance and application of Quality of Service (QoS) profiles.
-   **Key Concepts:** ROS 2 Topics, Publisher, Subscriber, Publish/Subscribe Pattern, Asynchronous Communication, Message Types, `std_msgs`, Custom Messages (IDL), `ros2 interface show`, `ros2 msg create`, Quality of Service (QoS) Profiles, `QoSProfile`, Reliability, Durability, History, Depth, `rclpy.create_publisher()`, `rclpy.create_subscription()`.
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.2.1: Detailed Publish/Subscribe communication flow, showing one publisher to multiple subscribers, data packets, and the role of DDS.]`
    -   `[DIAGRAM 2.2.2: Visualization of a custom message definition (.msg) structure and its mapping to Python class attributes.]`
-   **Python Code Snippet Placeholders (rclpy):**
    -   `[CODE SNIPPET 2.2.1: Python publisher sending `std_msgs/String` messages at a fixed rate.]`
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
    -   `[CODE SNIPPET 2.2.2: Python subscriber receiving `std_msgs/String` messages and printing them.]`
    ```python
    import rclpy
    from rclpy.node import Node
    from std_msgs.msg import String

    class MinimalSubscriber(Node):
        def __init__(self):
            super().__init__('minimal_subscriber')
            self.subscription = self.create_subscription(
                String,
                'topic',
                self.listener_callback,
                10) # QoS depth
            self.subscription  # prevent unused variable warning

        def listener_callback(self, msg):
            self.get_logger().info(f'I heard: "{msg.data}"')

    def main(args=None):
        rclpy.init(args=args)
        minimal_subscriber = MinimalSubscriber()
        rclpy.spin(minimal_subscriber)
        minimal_subscriber.destroy_node()
        rclpy.shutdown()

    if __name__ == '__main__':
        main()
    ```
    -   `[CODE SNIPPET 2.2.3: Example of defining a custom message type (e.g., `RobotPose.msg`) and demonstrating its use in a publisher/subscriber.]`
    ```python
    # In my_robot_controller/msg/RobotPose.msg
    # float32 x
    # float32 y
    # float32 theta

    # Python publisher using custom message (assuming message built and sourced)
    import rclpy
    from rclpy.node import Node
    from my_robot_controller.msg import RobotPose # Import custom message
    import time

    class CustomPublisher(Node):
        def __init__(self):
            super().__init__('custom_publisher')
            self.publisher_ = self.create_publisher(RobotPose, 'robot_pose', 10)
            timer_period = 1.0
            self.timer = self.create_timer(timer_period, self.timer_callback)
            self.x, self.y, self.theta = 0.0, 0.0, 0.0

        def timer_callback(self):
            msg = RobotPose()
            msg.x = self.x
            msg.y = self.y
            msg.theta = self.theta
            self.publisher_.publish(msg)
            self.get_logger().info(f'Publishing Pose: x={msg.x:.2f}, y={msg.y:.2f}, theta={msg.theta:.2f}')
            self.x += 0.1
            self.y += 0.05
            self.theta += 0.01

    def main(args=None):
        rclpy.init(args=args)
        node = CustomPublisher()
        rclpy.spin(node)
        node.destroy_node()
        rclpy.shutdown()

    if __name__ == '__main__':
        main()

    # Python subscriber using custom message
    import rclpy
    from rclpy.node import Node
    from my_robot_controller.msg import RobotPose # Import custom message

    class CustomSubscriber(Node):
        def __init__(self):
            super().__init__('custom_subscriber')
            self.subscription = self.create_subscription(
                RobotPose,
                'robot_pose',
                self.listener_callback,
                10)

        def listener_callback(self, msg):
            self.get_logger().info(f'Received Pose: x={msg.x:.2f}, y={msg.y:.2f}, theta={msg.theta:.2f}')

    def main(args=None):
        rclpy.init(args=args)
        node = CustomSubscriber()
        rclpy.spin(node)
        node.destroy_node()
        rclpy.shutdown()

    if __name__ == '__main__':
        main()
    ```
    -   `[CODE SNIPPET 2.2.4: Publisher/subscriber with explicit QoS settings (e.g., `ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE`).]`
    ```python
    import rclpy
    from rclpy.node import Node
    from std_msgs.msg import String
    from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy, DurabilityPolicy

    class QoSPublisher(Node):
        def __init__(self):
            super().__init__('qos_publisher')
            qos_profile = QoSProfile(
                reliability=ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE,
                history=HistoryPolicy.RMW_QOS_POLICY_HISTORY_KEEP_LAST,
                depth=5,
                durability=DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_TRANSIENT_LOCAL
            )
            self.publisher_ = self.create_publisher(String, 'qos_topic', qos_profile)
            self.timer = self.create_timer(1.0, self.timer_callback)
            self.i = 0

        def timer_callback(self):
            msg = String()
            msg.data = f'QoS Message {self.i}'
            self.publisher_.publish(msg)
            self.get_logger().info(f'Publishing: "{msg.data}" with QoS')
            self.i += 1

    class QoSSubscriber(Node):
        def __init__(self):
            super().__init__('qos_subscriber')
            qos_profile = QoSProfile(
                reliability=ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE,
                history=HistoryPolicy.RMW_QOS_POLICY_HISTORY_KEEP_LAST,
                depth=5,
                durability=DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_TRANSIENT_LOCAL
            )
            self.subscription = self.create_subscription(
                String,
                'qos_topic',
                self.listener_callback,
                qos_profile) # Pass QoS profile here

        def listener_callback(self, msg):
            self.get_logger().info(f'I heard (QoS): "{msg.data}"')

    def main(args=None):
        rclpy.init(args=args)
        publisher = QoSPublisher()
        subscriber = QoSSubscriber()

        executor = rclpy.executors.MultiThreadedExecutor()
        executor.add_node(publisher)
        executor.add_node(subscriber)

        try:
            executor.spin()
        except KeyboardInterrupt:
            pass
        finally:
            executor.shutdown()
            publisher.destroy_node()
            subscriber.destroy_node()
            rclpy.shutdown()

    if __name__ == '__main__':
        main()
    ```
-   **Content Notes:** This section will comprehensively cover topics. It will explain the publisher/subscriber roles, how to use `rclpy` to create them, and the importance of message types. Detail standard message types (`std_msgs`) and guide students through creating custom `.msg` files using ROS IDL, building them with `colcon`, and using them in Python. A significant portion will be dedicated to QoS profiles, explaining reliability, durability, history, and depth policies with practical examples of their impact on communication. Examples will include both `std_msgs` and custom messages.
-   **RAG Chunking Note:** This is a multi-part RAG chunk. Sub-sections will include: "Publishers and Subscribers," "ROS 2 Message Types," "Custom Messages (ROS IDL)," and "Understanding Quality of Service (QoS)." Each sub-section's code will be embedded within its respective chunk.

### 2.3 Services: Synchronous Request/Response
-   **Learning Objectives:**
    -   Understand the synchronous request/response communication model.
    -   Implement ROS 2 service servers and clients in Python using `rclpy`.
    -   Learn to define and use custom ROS IDL service types.
-   **Key Concepts:** ROS 2 Services, Service Server, Service Client, Request/Response Pattern, Synchronous Communication, Service Types (IDL), `ros2 interface show`, `ros2 srv create`, `rclpy.create_service()`, `rclpy.create_client()`, `client.call_async()`.
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.3.1: Detailed Service client-server interaction flow, showing request and response packets.]`
-   **Python Code Snippet Placeholders (rclpy):**
    -   `[CODE SNIPPET 2.3.1: Python service server implementing a simple addition service.]`
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
    -   `[CODE SNIPPET 2.3.2: Python service client making a request to the addition service and handling the response.]`
    ```python
    import rclpy
    from rclpy.node import Node
    from example_interfaces.srv import AddTwoInts
    import sys

    class MinimalClientAsync(Node):
        def __init__(self):
            super().__init__('minimal_client_async')
            self.cli = self.create_client(AddTwoInts, 'add_two_ints')
            while not self.cli.wait_for_service(timeout_sec=1.0):
                self.get_logger().info('service not available, waiting again...')
            self.req = AddTwoInts.Request()

        def send_request(self, a, b):
            self.req.a = a
            self.req.b = b
            self.future = self.cli.call_async(self.req)
            self.get_logger().info(f'Requesting: {a} + {b}')
            rclpy.spin_until_future_complete(self, self.future)
            return self.future.result()

    def main(args=None):
        rclpy.init(args=args)

        if len(sys.argv) != 3:
            print('Usage: ros2 run <package_name> minimal_client_async <arg1> <arg2>')
            return

        minimal_client = MinimalClientAsync()
        response = minimal_client.send_request(int(sys.argv[1]), int(sys.argv[2]))
        minimal_client.get_logger().info(f'Result of add_two_ints: {response.sum}')

        minimal_client.destroy_node()
        rclpy.shutdown()

    if __name__ == '__main__':
        main()
    ```
    -   `[CODE SNIPPET 2.3.3: Example of defining a custom service type (e.g., `SetSpeed.srv`) and demonstrating its use in a service server/client.]`
    ```python
    # In my_robot_controller/srv/SetSpeed.srv
    # float32 speed
    # ---
    # bool success

    # Python service server using custom service
    import rclpy
    from rclpy.node import Node
    from my_robot_controller.srv import SetSpeed # Import custom service

    class CustomServiceServer(Node):
        def __init__(self):
            super().__init__('custom_service_server')
            self.srv = self.create_service(SetSpeed, 'set_robot_speed', self.set_speed_callback)
            self.current_speed = 0.0
            self.get_logger().info('Set Speed Service Ready.')

        def set_speed_callback(self, request, response):
            self.current_speed = request.speed
            response.success = True
            self.get_logger().info(f'Received speed request: {request.speed}. Current speed set to {self.current_speed}')
            return response

    def main(args=None):
        rclpy.init(args=args)
        server_node = CustomServiceServer()
        rclpy.spin(server_node)
        server_node.destroy_node()
        rclpy.shutdown()

    if __name__ == '__main__':
        main()

    # Python service client using custom service
    import rclpy
    from rclpy.node import Node
    from my_robot_controller.srv import SetSpeed
    import sys

    class CustomServiceClient(Node):
        def __init__(self):
            super().__init__('custom_service_client')
            self.cli = self.create_client(SetSpeed, 'set_robot_speed')
            while not self.cli.wait_for_service(timeout_sec=1.0):
                self.get_logger().info('custom service not available, waiting again...')
            self.req = SetSpeed.Request()

        def send_request(self, speed_value):
            self.req.speed = float(speed_value)
            self.future = self.cli.call_async(self.req)
            self.get_logger().info(f'Requesting speed change to: {self.req.speed}')
            rclpy.spin_until_future_complete(self, self.future)
            return self.future.result()

    def main(args=None):
        rclpy.init(args=args)

        if len(sys.argv) != 2:
            print('Usage: ros2 run <package_name> custom_service_client <speed_value>')
            return

        client_node = CustomServiceClient()
        response = client_node.send_request(sys.argv[1])
        if response.success:
            client_node.get_logger().info(f'Service call successful: speed set.')
        else:
            client_node.get_logger().warn(f'Service call failed.')

        client_node.destroy_node()
        rclpy.shutdown()

    if __name__ == '__main__':
        main()
    ```
-   **Content Notes:** This section will detail synchronous services. It will cover the server and client roles, how to implement them in `rclpy`, and how to define custom `.srv` files using ROS IDL. The explanation will contrast services with topics, highlighting their use cases for one-shot requests with immediate responses. Examples will include both standard and custom service types.
-   **RAG Chunking Note:** This section will form a distinct RAG chunk. Sub-sections will include: "Service Servers and Clients," and "Custom Services (ROS IDL)." Code snippets will be embedded within their respective chunks.

### 2.4 Actions: Asynchronous Goal-Oriented Tasks
-   **Learning Objectives:**
    -   Explain the asynchronous goal/feedback/result communication model for long-running tasks.
    -   Implement ROS 2 action servers and clients in Python using `rclpy`.
    -   Define and use custom ROS IDL action types.
    -   Understand how to manage asynchronous execution, handle feedback, and implement task cancellation.
-   **Key Concepts:** ROS 2 Actions, Action Server, Action Client, Goal, Feedback, Result, Action Types (IDL), Asynchronous Task Management, Goal Preemption/Cancellation, `ros2 action create`, `rclpy.action.ActionServer`, `rclpy.action.ActionClient`, `GoalStatus`, `Future`.
-   **Diagram Placeholders:**
    -   `[DIAGRAM 2.4.1: Detailed Action client-server interaction flow, illustrating goal sending, continuous feedback, and final result/cancellation.]`
    -   `[DIAGRAM 2.4.2: State machine for a typical ROS 2 action, including pending, active, preempted, succeeded, aborted states.]`
-   **Python Code Snippet Placeholders (rclpy):**
    -   `[CODE SNIPPET 2.4.1: Python action server processing a goal (e.g., counting up to a number), sending periodic feedback, and returning a result.]`
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
    -   `[CODE SNIPPET 2.4.2: Python action client sending a goal, processing continuous feedback, and handling the final result or cancellation.]`
    ```python
    import rclpy
    from rclpy.action import ActionClient
    from rclpy.node import Node

    # Assuming custom action type in my_robot_controller/action/Fibonacci.action
    from my_robot_controller.action import Fibonacci # Import custom action

    import time
    import sys

    class FibonacciActionClient(Node):
        def __init__(self):
            super().__init__('fibonacci_action_client')
            self._action_client = ActionClient(self, Fibonacci, 'fibonacci')

        def send_goal(self, order):
            self.get_logger().info('Waiting for action server...')
            self._action_client.wait_for_server()

            goal_msg = Fibonacci.Goal()
            goal_msg.order = order

            self.get_logger().info(f'Sending goal request: {order}')

            self._send_goal_future = self._action_client.send_goal_async(
                goal_msg,
                feedback_callback=self.feedback_callback)

            self._send_goal_future.add_done_callback(self.goal_response_callback)

        def goal_response_callback(self, future):
            goal_handle = future.result()
            if not goal_handle.accepted:
                self.get_logger().info('Goal rejected :(')
                return

            self.get_logger().info('Goal accepted :)')

            self._get_result_future = goal_handle.get_result_async()
            self._get_result_future.add_done_callback(self.get_result_callback)

        def get_result_callback(self, future):
            result = future.result().result
            self.get_logger().info(f'Result: {result.sequence}')
            rclpy.shutdown() # Shutdown rclpy once result is received

        def feedback_callback(self, feedback_msg):
            self.get_logger().info(f'Received feedback: {feedback_msg.feedback.partial_sequence[-1]}')

    def main(args=None):
        rclpy.init(args=args)

        if len(sys.argv) != 2:
            print('Usage: ros2 run <package_name> fibonacci_action_client <order>')
            return

        action_client_node = FibonacciActionClient()
        action_client_node.send_goal(int(sys.argv[1]))

        rclpy.spin(action_client_node) # Spin until rclpy.shutdown() is called in get_result_callback

    if __name__ == '__main__':
        main()
    ```
    -   `[CODE SNIPPET 2.4.3: Example of defining a custom action type (e.g., `MoveToGoal.action`) and demonstrating its use.]`
    ```python
    # In my_robot_controller/action/MoveToGoal.action
    # float32 target_x
    # float32 target_y
    # ---
    # bool success
    # float32 final_x
    # float32 final_y
    # ---
    # float32 current_x
    # float32 current_y
    # float32 distance_to_goal
    ```
-   **Content Notes:** This section will provide a detailed explanation of actions for long-running, asynchronous tasks. It will cover the components: goal, feedback, and result. Step-by-step guidance on implementing Python action servers and clients with `rclpy` will be provided, including how to handle goal acceptance, continuous feedback publishing, and result processing. Critical aspects like task cancellation and asynchronous programming patterns (e.g., using `Future` objects) will be covered. The creation of custom `.action` files using ROS IDL will be demonstrated.
-   **RAG Chunking Note:** This section will be a comprehensive RAG chunk. Sub-sections will include: "Action Servers and Clients," "Goal, Feedback, and Result," "Custom Actions (ROS IDL)," and "Asynchronous Management and Cancellation." Each sub-section's code will be embedded within its respective chunk.

## Recommended Python Exercises / Examples
1.  **Exercise 2.1: ROS 2 Talker-Listener with Custom Message and QoS:**
    -   **Task:** Create a custom message type (e.g., `RobotPose` with `float32 x, y, theta`). Implement a Python publisher that sends `RobotPose` messages and a Python subscriber that receives and logs them. Experiment with different QoS settings (e.g., `ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE` vs. `ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_BEST_EFFORT`) and observe their impact on message delivery under simulated lossy conditions (e.g., starting subscriber after publisher has sent some messages).
    -   **Learning:** Practical application of custom message types and a deeper understanding of QoS implications.
2.  **Exercise 2.2: Simple Robot Control Service:**
    -   **Task:** Define a custom service (`SetSpeed.srv` with a `float32 speed` request and a `bool success` response). Implement a Python service server that accepts a speed command and simply logs it, returning `True`. Implement a Python service client that sends speed requests and prints the success status.
    -   **Learning:** Hands-on implementation of request/response patterns and custom service definitions.
3.  **Exercise 2.3: "Move to Goal" Action with Cancellation:**
    -   **Task:** Define a custom action (`MoveToGoal.action` with `float32 target_x, target_y` as goal, `bool success, float32 final_x, float32 final_y` as result, and `float32 current_x, float32 current_y, float32 distance_to_goal` as feedback). Implement a Python action server that simulates moving to the goal, sends continuous feedback, and allows for preemption/cancellation. Implement a Python action client that sends a goal, displays feedback, and demonstrates how to send a cancellation request.
    -   **Learning:** Comprehensive understanding of actions, asynchronous task management, and preemption in ROS 2.

## Cross-References to Future Chapters
-   **Chapter 1 (Introduction to ROS 2 for Physical AI):** This chapter provides the essential foundational knowledge, directly building upon the high-level overview of ROS 2 concepts introduced in Chapter 1.
-   **Chapter 3 (Python Agents with rclpy):** The communication primitives (nodes, topics, services, actions) mastered in this chapter are fundamental building blocks for creating the more complex, intelligent, and autonomous Python agents that will be the exclusive focus of Chapter 3.
-   **Module 2 (The Digital Twin - Simulation):** A solid understanding of ROS 2 communication mechanisms is absolutely critical for effectively integrating simulated robots (using environments like Gazebo and Unity) with ROS 2 control interfaces and perception pipelines.
-   **Module 3 (The AI-Robot Brain - NVIDIA Isaac):** The principles of distributed communication and node interaction are continuously applied when working with advanced AI perception and control frameworks like NVIDIA Isaac Sim and Isaac ROS.

## Output Structure Notes
-   Each section and sub-section will be clearly demarcated with Markdown headings.
-   Learning objectives, key concepts, code, and diagram placeholders will be explicit.
-   Key terms will be highlighted for RAG optimization.
-   Exercises will be clearly listed with brief descriptions.
