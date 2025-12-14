---
id: Course Overview
sidebar_position: 2
---

---
# Physical AI & Humanoid Robotics

## Course Overview
**Focus and Theme:** AI Systems in the Physical World – Embodied Intelligence.  
**Goal:** Bridging the gap between the digital brain and the physical body. Students apply AI knowledge to control humanoid robots in simulated and real-world environments.

The future of AI extends beyond digital spaces into the physical world. This capstone quarter introduces **Physical AI**—AI systems that function in reality and comprehend physical laws. Students learn to design, simulate, and deploy humanoid robots capable of natural human interactions using ROS 2, Gazebo, and NVIDIA Isaac.

---

## Modules

### Module 1: The Robotic Nervous System (ROS 2)
**Focus:** Middleware for robot control  
- ROS 2 Nodes, Topics, and Services  
- Bridging Python Agents to ROS controllers using `rclpy`  
- Understanding URDF (Unified Robot Description Format) for humanoids  

### Module 2: The Digital Twin (Gazebo & Unity)
**Focus:** Physics simulation and environment building  
- Simulating physics, gravity, and collisions in Gazebo  
- High-fidelity rendering and human-robot interaction in Unity  
- Simulating sensors: LiDAR, Depth Cameras, and IMUs  

### Module 3: The AI-Robot Brain (NVIDIA Isaac™)
**Focus:** Advanced perception and training  
- NVIDIA Isaac Sim: Photorealistic simulation and synthetic data generation  
- Isaac ROS: Hardware-accelerated VSLAM and navigation  
- Nav2: Path planning for bipedal humanoid movement  

### Module 4: Vision-Language-Action (VLA)
**Focus:** Convergence of LLMs and Robotics  
- Voice-to-Action: Using OpenAI Whisper for voice commands  
- Cognitive Planning: Translate natural language into ROS 2 actions  
- **Capstone Project:** Autonomous Humanoid – simulated robot executes voice commands, navigates, identifies objects, and manipulates them  

---

## Why Physical AI Matters
Humanoid robots share our physical form and can be trained with abundant real-world data. This course transitions AI from digital-only models to **embodied intelligence** that operates in physical space.

---

## Learning Outcomes
- Understand Physical AI principles and embodied intelligence  
- Master ROS 2 for robotic control  
- Simulate robots with Gazebo and Unity  
- Develop with NVIDIA Isaac AI robot platform  
- Design humanoid robots for natural interactions  
- Integrate GPT models for conversational robotics  

---

## Weekly Breakdown

| Week | Topics |
|------|--------|
| 1-2  | Introduction to Physical AI, sensors (LIDAR, cameras, IMUs) |
| 3-5  | ROS 2 architecture, nodes, topics, services, Python packages |
| 6-7  | Robot Simulation with Gazebo, URDF/SDF, Unity visualization |
| 8-10 | NVIDIA Isaac Platform: AI perception, manipulation, RL, sim-to-real |
| 11-12| Humanoid Robot Development: kinematics, locomotion, manipulation, human-robot interaction |
| 13   | Conversational Robotics: GPT integration, speech recognition, multi-modal interaction |

---

## Assessments
- ROS 2 package development project  
- Gazebo simulation implementation  
- Isaac-based perception pipeline  
- **Capstone:** Simulated humanoid robot with conversational AI  

---

## Hardware Requirements

### 1. Digital Twin Workstation (per student)
- **GPU:** NVIDIA RTX 4070 Ti (12GB VRAM) minimum; 3090/4090 recommended  
- **CPU:** Intel Core i7 (13th Gen+) / AMD Ryzen 9  
- **RAM:** 64 GB DDR5 (32 GB minimum)  
- **OS:** Ubuntu 22.04 LTS  
- Purpose: Run Isaac Sim, Gazebo, Unity, VLA models  

### 2. Physical AI Edge Kit
- **Brain:** NVIDIA Jetson Orin Nano (8GB) / Orin NX (16GB)  
- **Eyes:** Intel RealSense D435i / D455  
- **Inner Ear:** USB IMU (BNO055)  
- **Voice Interface:** USB Microphone/Speaker array (e.g., ReSpeaker)  

### 3. Robot Lab Options
- **Option A:** Proxy robot (Unitree Go2 Edu) – budget-friendly  
- **Option B:** Miniature humanoid (Unitree G1, Robotis OP3, Hiwonder TonyPi Pro)  
- **Option C:** Premium lab for real humanoids (Unitree G1)  

### 4. Cloud-Based Alternative
- Cloud workstations (AWS/Azure) with GPUs for Isaac Sim  
- Edge deployment on Jetson kits to mitigate latency  

### Total Approximate Cost (Economy Kit): ~$700 per student  

---

This course prepares students for **real-world Physical AI** development, bridging high-fidelity simulations and real humanoid deployment.  
