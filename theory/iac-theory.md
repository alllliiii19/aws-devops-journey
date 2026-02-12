# Infrastructure as Code (IaC)

## 📖 Introduction
IaC is the management of infrastructure (networks, virtual machines, load balancers, and connection topology) in a descriptive model, using the same versioning as DevOps team uses for source code.

## 🧠 Key Concepts

### 1. Declarative vs. Imperative
*   **Imperative (Procedural):** You define the *steps* to achieve the desired state (e.g., "Run this script, then install this, then start that").
*   **Declarative (Functional):** You define the *desired end state*, and the tool figures out how to get there (e.g., "I want 3 servers and a Load Balancer").

### 2. Idempotency
An operation is idempotent if the result of performing it once is exactly the same as the result of performing it multiple times without changing the result beyond the initial application.
*   *Example:* A script that says "Create file X" is **not** idempotent (it fails the second time). A script that says "Ensure file X exists" **is** idempotent.

### 3. Immutable vs. Mutable Infrastructure
*   **Mutable:** Servers are patched and updated in place (SSH in and run `apt-get update`). Leads to "Configuration Drift."
*   **Immutable:** Servers are never modified after deployment. If you need an update, you destroy the old server and bake a new image to replace it.

## 📚 Recommended Reading
*   *Infrastructure as Code* by Kief Morris
*   *Terraform: Up & Running* by Yevgeniy Brikman