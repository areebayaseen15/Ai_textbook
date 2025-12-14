# Quickstart: Python Agents with rclpy

## Prerequisites

- ROS 2 Humble Hawksbill installed
- Python 3.8 or higher
- Basic Python programming knowledge
- Understanding of ROS 2 concepts (covered in Chapters 1-2)

## Setup Environment

```bash
# Source ROS 2 Humble
source /opt/ros/humble/setup.bash

# Create a new ROS 2 workspace (if needed)
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Install rclpy (usually included with ROS 2)
# Verify installation
python3 -c "import rclpy; print('rclpy available')"
```

## Basic Node Template

Create a minimal Python ROS 2 node:

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
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
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

## Running the Node

```bash
# Make the script executable
chmod +x minimal_publisher.py

# Run the node
python3 minimal_publisher.py
```

## Creating a Package

```bash
# Create a new package
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_robot_controller --dependencies rclpy std_msgs

# Add your Python files to the package
# Edit setup.py to include your executables
```

## Example: Python Agent Bridging to ROS Controller

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from geometry_msgs.msg import Twist

class PythonAgentBridge(Node):
    def __init__(self):
        super().__init__('python_agent_bridge')

        # Publisher to send commands to robot controller
        self.cmd_vel_publisher = self.create_publisher(Twist, '/cmd_vel', 10)

        # Subscriber to receive sensor feedback
        self.sensor_subscriber = self.create_subscription(
            Float32, '/sensor_feedback', self.sensor_callback, 10
        )

        # Timer for agent decision making
        self.agent_timer = self.create_timer(0.1, self.agent_decision)

        self.feedback_value = 0.0

    def sensor_callback(self, msg):
        self.feedback_value = msg.data
        self.get_logger().info(f'Received feedback: {self.feedback_value}')

    def agent_decision(self):
        # Simple AI decision based on sensor feedback
        cmd = Twist()
        if self.feedback_value > 1.0:
            cmd.linear.x = 0.5  # Move forward slowly
        else:
            cmd.linear.x = 1.0  # Move forward faster
        cmd.angular.z = 0.0     # No rotation

        self.cmd_vel_publisher.publish(cmd)

def main(args=None):
    rclpy.init(args=args)
    agent_bridge = PythonAgentBridge()
    rclpy.spin(agent_bridge)
    agent_bridge.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Running the Example

```bash
# Terminal 1: Run the Python agent bridge
python3 python_agent_bridge.py

# Terminal 2: Monitor the command topic
ros2 topic echo /cmd_vel geometry_msgs/msg/Twist

# Terminal 3: Simulate sensor feedback
ros2 topic pub /sensor_feedback std_msgs/msg/Float32 '{data: 1.5}'
```

## Key Concepts Covered

1. **Node Creation**: Initialize and run a ROS 2 node in Python
2. **Publishing**: Send messages to ROS topics
3. **Subscribing**: Receive messages from ROS topics
4. **Parameter Management**: Configure node behavior
5. **Bridge Pattern**: Connect Python agents to ROS controllers
6. **RAG Chunking**: Structure content for AI integration

## Next Steps

- Explore Chapter3-01-NodeCreation.md for detailed node creation
- Review Chapter3-02-PublishSubscribe.md for communication patterns
- Check Chapter3-03-Services.md for synchronous operations
- Study Chapter3-04-Actions.md for long-running tasks