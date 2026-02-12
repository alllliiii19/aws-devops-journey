# Containerization & Microservices Architecture

## 📖 Introduction
Moving away from monolithic applications running on heavy Virtual Machines toward lightweight, loosely coupled services.

## 🧠 Key Concepts

### 1. Virtual Machines vs. Containers
*   **VMs:** Virtualize the *Hardware*. Each VM has a full Guest OS. Heavy, slow to boot.
*   **Containers:** Virtualize the *Operating System*. Containers share the host OS kernel but have isolated user spaces (Process isolation). Lightweight, instant boot.

### 2. Microservices Architecture
Structuring an application as a collection of services that are:
*   Highly maintainable and testable.
*   Loosely coupled.
*   Independently deployable.
*   Organized around business capabilities.
*   *Trade-off:* Increased complexity in networking and data consistency (CAP Theorem).

### 3. Orchestration Theory
When you have hundreds of containers, you need a system to manage them. Orchestrators handle:
*   **Scheduling:** Deciding which machine runs which container.
*   **Self-Healing:** Restarting failed containers.
*   **Service Discovery:** How containers find each other.

## 📚 Recommended Reading
*   *Building Microservices* by Sam Newman
*   *Kubernetes Patterns* by Bilgin Ibryam