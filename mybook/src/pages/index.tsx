import React, { JSX } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="AI & Robotics Textbook | Panaversity Style Homepage"
    >
      {/* ----- HERO SECTION (Black/Grey Panaversity Style) ----- */}
      <header className={styles.heroBanner}>
        <div className="container">
          <h1 className={styles.heroTitle}>Start Your AI-Native <br/>Robotics Journey</h1>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>

          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="docs/intro">
              Start Reading 📖
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------
           MAIN SECTIONS START
      ---------------------------------------------- */}
      <main>

        {/* ----- NEW MODULES SECTION ----- */}
        <section className={styles.modulesSection}>
          <div className={styles.modulesContainer}>
            <h2>What You Will Learn</h2>

            <div className={styles.moduleItem}>
              <h3>Module 1 — ROS 2 Foundations</h3>
              <p>Nodes, Topics, Services, rclcpp, and robot communication architecture.</p>
            </div>

            <div className={styles.moduleItem}>
              <h3>Module 2 — Sensors, Perception & SLAM</h3>
              <p>Depth cameras, LiDAR, mapping, localization and 3D understanding.</p>
            </div>

            <div className={styles.moduleItem}>
              <h3>Module 3 — Navigation & Control</h3>
              <p>PID, trajectory planning, path following, Nav2 stack, and autonomous robots.</p>
            </div>

            <div className={styles.moduleItem}>
              <h3>Module 4 — Vision + Language + Action</h3>
              <p>VLMs, LLM planning, task automation and AI-native robotic agents.</p>
            </div>
          </div>
        </section>

        {/* ----- WHY THIS BOOK (Your Old Feature Section) ----- */}
        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Why This Book?</h2>
              <p>Learn AI-Native Robotics with a structured, modern, and hands-on textbook.</p>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤖</div>
                <h3>AI + Robotics</h3>
                <p>Complete guide to modern AI-native robotic systems.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>⚙️</div>
                <h3>ROS 2 Based</h3>
                <p>Learn ROS 2 ecosystem with practical examples.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📚</div>
                <h3>Project Driven</h3>
                <p>Every chapter includes projects, diagrams, and exercises.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ----- NEW Why This Book (Extra Professional Grid) ----- */}
        <section className={styles.whySection}>
          <div className={styles.whyContainer}>
            <h2>Designed for AI-Native Robotics Engineers</h2>

            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>
                <h3>100% Hands-On Learning</h3>
                <p>Everything is project-based with real robotics workflows.</p>
              </div>

              <div className={styles.whyCard}>
                <h3>Industry Standard Tools</h3>
                <p>Uses ROS 2, Nav2, OpenCV, VLMs, LLM agents and more.</p>
              </div>

              <div className={styles.whyCard}>
                <h3>AI-Integrated Curriculum</h3>
                <p>Built with Claude, ChatGPT and Spec-Kit automated workflows.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ----- AUTHOR / AI CURRICULUM ----- */}
        <section className={styles.authorSection}>
          <div className={styles.authorContainer}>
          <div className={styles.authorImage}>
  <img 
    src="data:image/jpeg;base64,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" 
    alt="AI Robotics Illustration"
  />
</div>

            <div className={styles.authorText}>
              <h2>AI-Generated Robotics Curriculum</h2>
              <p>
                This textbook is built using an AI-driven workflow combining
                Spec-Kit Plus, Claude Code, and ChatGPT 5. Each chapter is
                generated, validated, and auto-tested for accuracy and
                engineering correctness — ensuring the most modern robotics
                learning experience.
              </p>
            </div>
          </div>
        </section>

        {/* ----- CTA ----- */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h2>Start Your AI-Native Robotics Journey</h2>
              <p>
                This open textbook is designed for students, engineers, and
                researchers who want hands-on learning with modern tools.
              </p>

              <div className={styles.ctaButtons}>
                <Link className="button button--secondary button--lg" to="docs/intro">
                  Begin Reading
                </Link>
                <Link className="button text-white button--secondary button--outline button--lg" to="/docs/category/chapter-1-introduction-to-ros2">
                  Browse All Modules
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
