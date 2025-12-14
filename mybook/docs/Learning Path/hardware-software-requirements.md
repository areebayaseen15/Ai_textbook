---
sidebar_position: 6
---

# Hardware Requirements

This course on Physical AI & Humanoid Robotics involves **high-performance simulation, AI perception, and real-world robot deployment**. Depending on your role—student, researcher, or professional—you can choose from different hardware setups.

---

## 1. Simulation Workstation (Digital Twin)

A workstation is required to run **ROS 2, Gazebo, Unity, and NVIDIA Isaac Sim** efficiently.

| Component | Recommended | Notes |
|-----------|------------|-------|
| CPU       | AMD Ryzen 7 / Intel i7 | Multi-core for physics calculations |
| GPU       | NVIDIA RTX 3080 / 4080 | Required for Isaac Sim rendering & VLA models |
| RAM       | 32GB+ | Smooth simulation and multitasking |
| Storage   | 1TB NVMe SSD | Fast loading of large simulation assets |
| OS        | Ubuntu 22.04 LTS | Native support for ROS 2 |

**Student Setup:** RTX 3060, 16GB RAM, 500GB SSD (~$1,200)  
**Professional Setup:** RTX 4090, 64GB RAM, 2TB SSD + 4TB HDD (~$4,000)

---

## 2. Edge AI Kit (Jetson)

Used for **deploying AI models on physical robots**.

| Kit | Specs | Purpose |
|-----|-------|---------|
| Jetson Orin Nano | 1024 CUDA cores, 40 TOPS, 8GB LPDDR5 | Learning & prototyping |
| Jetson Orin NX | 1024 CUDA cores, 100 TOPS, 8GB LPDDR5 | Advanced AI deployment |

Accessories: RealSense camera for vision, IMU for balance, USB mic for voice commands.

---

## 3. Robot Platforms

Depending on your budget and project goals:

| Option | Robot | Features | Price |
|--------|-------|---------|-------|
| Educational | TurtleBot 4 / Jackal | ROS 2 support, modular | ~$4,000-8,000 |
| Custom Humanoid | Unitree Go1 / AlienGo | High payload, ROS 2 integration | ~$20,000-40,000 |
| Research | ANYmal / Custom humanoid | Fully flexible, advanced sensors | ~$50,000-150,000 |

---

## 4. Cloud-Based Alternatives

For students without access to physical hardware:

- **AWS RoboMaker**: Robotics simulation in the cloud  
- **NVIDIA Omniverse**: Photorealistic simulation & Isaac Sim  
- **EC2 G5 instances**: RTX GPUs for AI processing  

**Example Configuration:** g5.2xlarge instance, 100GB SSD, $1-3/hr.

---

## 5. Hardware Architecture Overview

**Simulation & Development:**
[Workstation] → [ROS 2 / Isaac / Gazebo / Unity] → [Virtual Humanoid]


**Deployment on Robot:**
[Jetson Edge AI] → [Robot Hardware] → [Sensors & Actuators]


---

:::note
Start with simulations before investing in hardware. This ensures safe testing of AI and control algorithms.
:::

:::tip
Choose your setup based on course goals: simulation only, edge AI, or full humanoid deployment.
:::
