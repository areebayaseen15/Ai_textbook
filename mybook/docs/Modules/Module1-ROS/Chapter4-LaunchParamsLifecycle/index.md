---
id: Chapter4-LaunchParamsLifecycle
title: Chapter 4 - Launch Files, Parameters, and Lifecycle Nodes
sidebar_label: Launch Files, Parameters, Lifecycle
sidebar_position: 4
---

# Chapter 4: Launch Files, Parameters, and Lifecycle Nodes

## Overview

This chapter covers the essential ROS 2 (Robot Operating System 2) concepts of launch files, parameters, and lifecycle nodes. These components form the backbone of production-ready robotic systems, enabling orchestrated node startup, configurable robot behavior, and robust state management.

## Learning Objectives

By the end of this chapter, you will be able to:

1. Create and use Python-based launch files for multi-node robot systems
2. Configure ROS 2 parameters using YAML files and runtime APIs
3. Implement lifecycle nodes with proper state management
4. Combine launch files, parameters, and lifecycle nodes in integrated systems
5. Structure content for RAG (Retrieval-Augmented Generation) systems

## Chapter Structure

This chapter is divided into several comprehensive sections:

- **Section 1**: Introduction to the ROS 2 Launch System
- **Section 2**: Launch Files Basics
- **Section 3**: Multi-Node Launch Files
- **Section 4**: ROS 2 Parameters
- **Section 5**: Lifecycle Nodes
- **Section 6**: Integrated Examples
- **Section 7**: Exercises

Each section includes practical examples, code snippets, and exercises designed to reinforce your understanding of these advanced ROS 2 concepts.

<!-- DIAGRAM: Chapter 4 Overview - Launch, Parameters, Lifecycle Integration -->

## Section 1: Introduction to Launch System

<!-- CHUNK START: Section 1 - Introduction to Launch System -->

ROS 2 provides a sophisticated launch system that enables orchestrated startup, configuration, and management of multiple nodes in a robotic system. The launch system addresses critical challenges that arise when working with complex robot applications that require multiple coordinated nodes.

### Purpose of the Launch System

The ROS 2 launch system serves several critical purposes in robotic applications:

1. **Orchestrated Startup**: Launch multiple nodes in a coordinated manner with proper dependencies and timing
2. **Configuration Management**: Pass parameters, namespaces, and remappings to nodes at startup
3. **Process Management**: Handle node lifecycle, restart policies, and graceful shutdown
4. **Reusability**: Create reusable launch configurations for different robot types or operating modes

### Problems with Standalone CLI Node Launching

Without a proper launch system, robotic applications face several challenges:

- **Manual Startup**: Each node must be started individually in separate terminals
- **Parameter Management**: Parameters must be set manually for each node
- **No Coordination**: No way to ensure nodes start in the correct order
- **No Monitoring**: Difficult to monitor the overall system state
- **No Recovery**: No automatic restart of failed nodes

### Launch System Architecture

The launch system consists of launch files that define the desired system configuration, launch actions that perform specific operations, and launch arguments that allow for parameterization.

<!-- DIAGRAM: Launch System Architecture -->

```python
# Example of basic launch file structure
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # Launch actions go here
    ])
```

<!-- CHUNK END: Section 1 - Introduction to Launch System -->

## Section 2: Launch Files Basics

<!-- CHUNK START: Section 2 - Launch Files Basics -->

### Launch File Structure

ROS 2 launch files can be written in Python or XML, with Python being the preferred approach for complex systems. The basic structure of a Python launch file includes:

1. **Import statements** for launch and ROS-specific actions
2. **LaunchDescription** that contains all actions to execute
3. **Node actions** that define which nodes to launch
4. **Parameter files** that configure node behavior
5. **Launch arguments** that allow for runtime configuration

### Python Launch File Template

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    # Define launch arguments
    param_file = LaunchConfiguration('param_file')

    # Declare launch arguments
    param_file_arg = DeclareLaunchArgument(
        'param_file',
        default_value='path/to/params.yaml',
        description='Path to parameters file'
    )

    # Define nodes
    node_example = Node(
        package='package_name',
        executable='node_name',
        name='node_name',
        parameters=[param_file]
    )

    # Return launch description
    return LaunchDescription([
        param_file_arg,
        node_example
    ])
```

### Launch Actions

Launch actions are the building blocks of launch files. The most common actions include:

- **Node**: Launch a ROS 2 node
- **TimerAction**: Execute an action after a specified time delay
- **IncludeLaunchDescription**: Include another launch file
- **GroupAction**: Group multiple actions together
- **DeclareLaunchArgument**: Define a launch argument

#### Node Action

The Node action is the most common launch action, used to start ROS 2 nodes:

```python
from launch_ros.actions import Node

sensor_node = Node(
    package='sensor_package',
    executable='sensor_node',
    name='lidar_sensor',
    parameters=[
        {'sensor_range': 10.0},
        'path/to/params.yaml'
    ],
    remappings=[
        ('/raw_data', '/filtered_data')
    ]
)
```

#### TimerAction

TimerAction allows for delayed execution of other actions:

```python
from launch.actions import TimerAction
from launch_ros.actions import Node

delayed_node = TimerAction(
    period=5.0,  # Wait 5 seconds
    actions=[Node(
        package='package_name',
        executable='delayed_node',
        name='delayed_node'
    )]
)
```

#### IncludeLaunchDescription

IncludeLaunchDescription allows for modular launch file organization:

```python
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

included_launch = IncludeLaunchDescription(
    PythonLaunchDescriptionSource([
        PathJoinSubstitution([
            FindPackageShare('package_name'),
            'launch',
            'other_launch_file.launch.py'
        ])
    ])
)
```

### Launch Arguments & Substitutions

Launch arguments provide a way to parameterize launch files, making them more flexible and reusable. Substitutions allow for dynamic value computation at launch time.

#### LaunchConfiguration

LaunchConfiguration allows launch arguments to be used within other launch actions:

```python
from launch.substitutions import LaunchConfiguration
from launch.actions import DeclareLaunchArgument

# Declare argument
param_file_arg = DeclareLaunchArgument(
    'param_file',
    default_value='default_params.yaml',
    description='Path to parameter file'
)

# Use in node
config_file = LaunchConfiguration('param_file')

node_with_params = Node(
    package='package_name',
    executable='node_name',
    parameters=[config_file]
)
```

#### Path Substitutions

Path substitutions help with file path construction:

```python
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

# Construct path to config file
config_path = PathJoinSubstitution([
    FindPackageShare('package_name'),
    'config',
    'params.yaml'
])

node_with_path = Node(
    package='package_name',
    executable='node_name',
    parameters=[config_path]
)
```

<!-- CHUNK END: Section 2 - Launch Files Basics -->

## Section 3: Multi-Node Launch Files

<!-- CHUNK START: Section 3 - Multi-Node Launch Files -->

### Launching Multiple Nodes

Multi-node launch files allow for the coordinated startup of complex robotic systems. This is essential for production robots that require multiple coordinated components.

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    # Define multiple nodes
    sensor_node = Node(
        package='sensor_package',
        executable='lidar_driver',
        name='lidar_driver',
        parameters=['config/lidar_params.yaml']
    )

    processing_node = Node(
        package='processing_package',
        executable='pointcloud_processor',
        name='pointcloud_processor',
        parameters=['config/processing_params.yaml']
    )

    navigation_node = Node(
        package='nav_package',
        executable='navigation',
        name='navigation',
        parameters=['config/nav_params.yaml']
    )

    return LaunchDescription([
        sensor_node,
        processing_node,
        navigation_node
    ])
```

### Namespaces & Remapping

Namespaces and remapping are crucial for organizing complex multi-node systems and avoiding naming conflicts.

#### Namespaces

Namespaces provide logical grouping of nodes and topics:

```python
from launch.actions import GroupAction
from launch_ros.actions import PushRosNamespace

# Group nodes under a namespace
sensor_group = GroupAction(
    actions=[
        PushRosNamespace('sensors'),
        Node(
            package='sensor_package',
            executable='lidar_driver',
            name='lidar'
        ),
        Node(
            package='sensor_package',
            executable='camera_driver',
            name='camera'
        )
    ]
)
```

#### Topic Remapping

Topic remapping allows nodes to connect to different topics than their default names:

```python
sensor_node = Node(
    package='sensor_package',
    executable='sensor_driver',
    name='sensor',
    remappings=[
        ('/sensor_raw', '/filtered_sensor_data'),
        ('/sensor_info', '/robot/sensor_info')
    ]
)
```

### Composable Nodes (Brief Introduction)

Composable nodes allow multiple nodes to run within a single process, reducing overhead and improving performance. This is achieved using the ComposableNodeContainer.

```python
from launch_ros.actions import ComposableNodeContainer
from launch_ros.descriptions import ComposableNode

# Create a container for composable nodes
container = ComposableNodeContainer(
    name=' perception_container',
    namespace='',
    package='rclcpp_components',
    executable='component_container',
    composable_node_descriptions=[
        ComposableNode(
            package='image_proc',
            plugin='image_proc::RectifyNode',
            name='rectify_node',
            remappings=[
                ('image', '/camera/image_raw'),
                ('camera_info', '/camera/camera_info'),
                ('image_rect', '/camera/image_rect')
            ]
        ),
        ComposableNode(
            package='image_view',
            plugin='image_view::ImageViewNode',
            name='image_view_node',
            remappings=[
                ('image', '/camera/image_rect')
            ]
        )
    ]
)
```

<!-- DIAGRAM: Multi-Node Launch Architecture -->

<!-- CHUNK END: Section 3 - Multi-Node Launch Files -->

## Section 4: ROS 2 Parameters

<!-- CHUNK START: Section 4 - ROS 2 Parameters -->

### Parameter Declaration

Parameters in ROS 2 provide a way to configure node behavior at runtime. They can be declared in the node code and accessed through the ROS 2 parameter system.

```python
import rclpy
from rclpy.node import Node
from rclpy.parameter import Parameter

class ParameterExampleNode(Node):
    def __init__(self):
        super().__init__('parameter_example_node')

        # Declare parameters with default values and descriptions
        self.declare_parameter('sensor_range', 10.0)
        self.declare_parameter('update_frequency', 10)
        self.declare_parameter('sensor_enabled', True)

        # Access parameter values
        self.sensor_range = self.get_parameter('sensor_range').value
        self.update_frequency = self.get_parameter('update_frequency').value
        self.sensor_enabled = self.get_parameter('sensor_enabled').value

        self.get_logger().info(f'Sensor range: {self.sensor_range}')
        self.get_logger().info(f'Update frequency: {self.update_frequency}')
        self.get_logger().info(f'Sensor enabled: {self.sensor_enabled}')
```

### YAML Parameter Files

YAML files provide a convenient way to organize and load parameters for multiple nodes:

```yaml
# params.yaml
lidar_driver:
  ros__parameters:
    sensor_range: 30.0
    update_frequency: 10
    sensor_enabled: true
    frame_id: 'lidar_frame'

camera_driver:
  ros__parameters:
    image_width: 640
    image_height: 480
    fps: 30
    exposure_time: 10000

navigation:
  ros__parameters:
    planner_frequency: 5.0
    controller_frequency: 20.0
    recovery_enabled: true
```

Loading parameters from YAML in a launch file:

```python
from launch_ros.actions import Node

sensor_node = Node(
    package='sensor_package',
    executable='lidar_driver',
    name='lidar_driver',
    parameters=[
        'config/lidar_params.yaml',
        {'sensor_range': 25.0}  # Override specific parameter
    ]
)
```

### Getting and Setting Parameters

Nodes can dynamically get and set parameters at runtime:

```python
class ParameterControlNode(Node):
    def __init__(self):
        super().__init__('parameter_control_node')

        # Declare parameter
        self.declare_parameter('control_mode', 'auto')

        # Create timer to periodically check parameters
        self.timer = self.create_timer(1.0, self.check_parameters)

        # Create service to change parameters
        self.set_param_service = self.create_service(
            SetParameters,
            'set_control_mode',
            self.set_control_mode_callback
        )

    def check_parameters(self):
        current_mode = self.get_parameter('control_mode').value
        self.get_logger().info(f'Current control mode: {current_mode}')

    def set_control_mode_callback(self, request, response):
        # Set parameter value
        self.set_parameters([Parameter('control_mode', Parameter.Type.STRING, 'manual')])
        response.successful = True
        response.result = 'Control mode set to manual'
        return response
```

### Dynamic Parameters

Dynamic parameters allow for runtime configuration changes with validation:

```python
from rcl_interfaces.msg import SetParametersResult

class DynamicParameterNode(Node):
    def __init__(self):
        super().__init__('dynamic_parameter_node')

        # Declare parameters with callbacks
        self.declare_parameter('velocity_limit', 1.0)
        self.declare_parameter('acceleration_limit', 0.5)

        # Register parameter callback
        self.add_on_set_parameters_callback(self.parameter_callback)

        # Initialize values
        self.velocity_limit = self.get_parameter('velocity_limit').value
        self.acceleration_limit = self.get_parameter('acceleration_limit').value

    def parameter_callback(self, params):
        result = SetParametersResult()
        result.successful = True

        for param in params:
            if param.name == 'velocity_limit':
                if param.value > 5.0:  # Maximum allowed velocity
                    result.successful = False
                    result.reason = 'Velocity limit too high'
                    return result
                self.velocity_limit = param.value
            elif param.name == 'acceleration_limit':
                if param.value > 2.0:  # Maximum allowed acceleration
                    result.successful = False
                    result.reason = 'Acceleration limit too high'
                    return result
                self.acceleration_limit = param.value

        return result
```

<!-- DIAGRAM: Parameter Server Flow -->

<!-- CHUNK END: Section 4 - ROS 2 Parameters -->

## Section 5: Lifecycle Nodes

<!-- CHUNK START: Section 5 - Lifecycle Nodes -->

### Lifecycle States

Lifecycle nodes provide a structured way to manage the state of ROS 2 nodes, enabling better coordination and resource management. The lifecycle state machine includes several states:

1. **Unconfigured**: Initial state after node creation
2. **Inactive**: Node configured but not active
3. **Active**: Node running and operational
4. **Finalized**: Node has been shut down and resources released
5. **Error**: Node is in an error state

<!-- DIAGRAM: Lifecycle State Machine -->

### Transition System

The lifecycle transition system provides a controlled way to move nodes between states:

```python
import rclpy
from rclpy.node import Node
from rclpy.lifecycle import LifecycleNode, TransitionCallbackReturn
from rclpy.lifecycle import LifecycleState

class LifecycleExampleNode(LifecycleNode):
    def __init__(self):
        super().__init__('lifecycle_example_node')
        self.get_logger().info('Lifecycle node created in unconfigured state')

    def on_configure(self, state):
        """Called when transitioning from unconfigured to inactive"""
        self.get_logger().info('Configuring node...')
        # Perform configuration tasks
        self.timer = self.create_timer(1.0, self.timer_callback)
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        """Called when transitioning from inactive to active"""
        self.get_logger().info('Activating node...')
        # Activate the timer
        self.timer.reset()
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        """Called when transitioning from active to inactive"""
        self.get_logger().info('Deactivating node...')
        # Deactivate the timer
        self.timer.cancel()
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        """Called when transitioning from inactive to unconfigured"""
        self.get_logger().info('Cleaning up node...')
        # Clean up resources
        self.timer.destroy()
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state):
        """Called when transitioning to finalized state"""
        self.get_logger().info('Shutting down node...')
        return TransitionCallbackReturn.SUCCESS

    def on_error(self, state):
        """Called when transitioning to error state"""
        self.get_logger().info('Node in error state')
        return TransitionCallbackReturn.SUCCESS

    def timer_callback(self):
        self.get_logger().info('Timer callback in lifecycle node')
```

### Launch Integration

Lifecycle nodes can be integrated with launch files to control their states:

```python
from launch import LaunchDescription
from launch_ros.actions import LifecycleNode
from launch.actions import EmitEvent
from launch.event_handlers import OnProcessStart
from launch.events import matches, Shutdown

def generate_launch_description():
    # Define lifecycle node
    lifecycle_node = LifecycleNode(
        package='lifecycle_package',
        executable='lifecycle_node',
        name='lifecycle_example',
        namespace='',
        parameters=['config/lifecycle_params.yaml']
    )

    # Transition to inactive state
    to_inactive = EmitEvent(
        event=matches(LifecycleNode, 'lifecycle_example')
    )

    # Transition to active state
    to_active = EmitEvent(
        event=matches(LifecycleNode, 'lifecycle_example')
    )

    return LaunchDescription([
        lifecycle_node,
        # Additional launch actions for state transitions
    ])
```

Using lifecycle manager to control node states:

```python
from launch_ros.actions import Node

# Launch lifecycle manager
lifecycle_manager = Node(
    package='lifecycle',
    executable='lifecycle_manager',
    name='lifecycle_manager',
    parameters=[
        {'use_sim_time': False},
        {'autostart_nodes': False}
    ]
)

# Launch the lifecycle node
lifecycle_node = Node(
    package='lifecycle_package',
    executable='lifecycle_node',
    name='lifecycle_example',
    # Note: This node will be managed by the lifecycle manager
)
```

<!-- CHUNK END: Section 5 - Lifecycle Nodes -->

## Section 6: Integrated Examples

<!-- CHUNK START: Section 6 - Integrated Examples -->

### Multi-Node Launch with Parameters

Here's a complete example combining multiple nodes with parameters and launch configuration:

```python
# robot_system.launch.py
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # Declare launch arguments
    robot_name = DeclareLaunchArgument(
        'robot_name',
        default_value='robot1',
        description='Name of the robot'
    )

    config_file = DeclareLaunchArgument(
        'config_file',
        default_value='default_params.yaml',
        description='Path to parameter file'
    )

    # Get launch configurations
    robot_name_config = LaunchConfiguration('robot_name')
    config_file_config = LaunchConfiguration('config_file')

    # Sensor node
    sensor_node = Node(
        package='sensor_package',
        executable='lidar_driver',
        name=['lidar_driver_', robot_name_config],
        parameters=[
            config_file_config,
            {'robot_name': robot_name_config}
        ],
        remappings=[
            ('/scan', [robot_name_config, '/scan'])
        ]
    )

    # Navigation node
    navigation_node = Node(
        package='nav_package',
        executable='navigation',
        name=['navigation_', robot_name_config],
        parameters=[config_file_config],
        remappings=[
            ('/cmd_vel', [robot_name_config, '/cmd_vel']),
            ('/map', [robot_name_config, '/map'])
        ]
    )

    # Localization node
    localization_node = Node(
        package='localization_package',
        executable='amcl',
        name=['localization_', robot_name_config],
        parameters=[config_file_config],
        remappings=[
            ('/scan', [robot_name_config, '/scan']),
            ('/tf', [robot_name_config, '/tf'])
        ]
    )

    return LaunchDescription([
        robot_name,
        config_file,
        sensor_node,
        navigation_node,
        localization_node
    ])
```

### Lifecycle Node with Transitions

Example of a lifecycle node that integrates with parameters:

```python
# lifecycle_sensor.py
import rclpy
from rclpy.node import Node
from rclpy.lifecycle import LifecycleNode, TransitionCallbackReturn
from sensor_msgs.msg import LaserScan

class LifecycleSensorNode(LifecycleNode):
    def __init__(self):
        super().__init__('lifecycle_sensor')

        # Declare parameters
        self.declare_parameter('sensor_range', 10.0)
        self.declare_parameter('update_frequency', 10)
        self.declare_parameter('sensor_enabled', True)

        self.sensor_range = self.get_parameter('sensor_range').value
        self.update_frequency = self.get_parameter('update_frequency').value
        self.sensor_enabled = self.get_parameter('sensor_enabled').value

        self.scan_publisher = None
        self.scan_timer = None

        self.get_logger().info('Lifecycle sensor node created')

    def on_configure(self, state):
        self.get_logger().info('Configuring lifecycle sensor...')

        # Create publisher
        self.scan_publisher = self.create_publisher(
            LaserScan,
            'scan',
            10
        )

        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        self.get_logger().info('Activating lifecycle sensor...')

        # Create and start timer
        self.scan_timer = self.create_timer(
            1.0 / self.update_frequency,
            self.publish_scan
        )

        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        self.get_logger().info('Deactivating lifecycle sensor...')

        # Cancel timer
        if self.scan_timer:
            self.scan_timer.cancel()

        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        self.get_logger().info('Cleaning up lifecycle sensor...')

        # Destroy publisher and timer
        if self.scan_publisher:
            self.scan_publisher.destroy()
        if self.scan_timer:
            self.scan_timer.destroy()

        return TransitionCallbackReturn.SUCCESS

    def publish_scan(self):
        if not self.sensor_enabled:
            return

        # Create and publish scan message
        scan_msg = LaserScan()
        scan_msg.header.stamp = self.get_clock().now().to_msg()
        scan_msg.header.frame_id = 'laser_frame'
        scan_msg.angle_min = -1.57  # -90 degrees
        scan_msg.angle_max = 1.57   # 90 degrees
        scan_msg.angle_increment = 0.01
        scan_msg.range_min = 0.1
        scan_msg.range_max = self.sensor_range
        scan_msg.ranges = [self.sensor_range / 2.0] * 314  # 314 points

        self.scan_publisher.publish(scan_msg)
        self.get_logger().info('Published scan message')

def main(args=None):
    rclpy.init(args=args)
    node = LifecycleSensorNode()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

<!-- CHUNK END: Section 6 - Integrated Examples -->

## Section 7: Exercises

<!-- CHUNK START: Section 7 - Exercises -->

### Exercise Set

1. **Write a Multi-Node Launch File**: Create a launch file that starts three nodes (sensor, processing, and visualization) with appropriate parameter files and remappings.

2. **Implement Parameter YAML**: Create a YAML parameter file that configures different settings for a navigation stack including costmap parameters, planner settings, and controller parameters.

3. **Convert Normal Node to Lifecycle Node**: Take a simple publisher node from Chapter 3 and convert it to a lifecycle node with proper state management.

4. **Trigger Activation Transitions**: Create a script that uses lifecycle services to transition a lifecycle node through different states (configure → activate → deactivate → cleanup).

5. **Parameter Validation**: Implement a node with dynamic parameter validation that ensures parameter values are within acceptable ranges.

6. **Launch with Namespaces**: Create a launch file that launches the same node multiple times with different namespaces to avoid naming conflicts.

7. **Composable Node Container**: Implement a launch file that uses a ComposableNodeContainer to run multiple simple nodes in a single process.

8. **Launch Arguments**: Create a launch file that uses launch arguments to select between different robot configurations (indoor vs outdoor, different parameter sets).

<!-- CHUNK END: Section 7 - Exercises -->

## Summary

This chapter covered the essential ROS 2 concepts of launch files, parameters, and lifecycle nodes. These components are crucial for building production-ready robotic systems that require coordinated startup, configurable behavior, and robust state management. The launch system enables orchestrated node startup, parameters provide runtime configuration, and lifecycle nodes offer structured state management.

Understanding these concepts is essential for creating scalable and maintainable robotic applications, and they build upon the foundational knowledge from Chapter 3 about Python agents with rclpy. These tools enable the creation of sophisticated robotic systems that can adapt to different operating conditions and manage complex state transitions safely.