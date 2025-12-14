const fs = require('fs');
const path = require('path');

// Define the directory renames
const renames = [
  { from: 'docs/Module 1 The Robotic Nervous System (ROS 2)', to: 'docs/Module1-The-Robotic-Nervous-System-ROS2' },
  { from: 'docs/Module 2 The Digital Twin (Gazebo & Unity)', to: 'docs/Module2-Digital-Twin' },
  { from: 'docs/Module 3 The AI-Robot Brain (NVIDIA Isaac™)', to: 'docs/Module3-AI-Robot-Brain' },
];

// Perform the renames
renames.forEach(rename => {
  if (fs.existsSync(rename.from)) {
    try {
      fs.renameSync(rename.from, rename.to);
      console.log(`Renamed: ${rename.from} → ${rename.to}`);
    } catch (error) {
      console.error(`Failed to rename ${rename.from}:`, error.message);
    }
  } else {
    console.log(`Directory does not exist: ${rename.from}`);
  }
});