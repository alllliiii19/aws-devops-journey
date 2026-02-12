# Continuous Integration & Continuous Deployment (CI/CD)

## 📖 Introduction
CI/CD forms the backbone of the modern software supply chain. It converts code into a deployable artifact and delivers it to the user.

## 🧠 Key Concepts

### 1. Continuous Integration (CI)
The practice of merging all developers' working copies to a shared mainline several times a day.
*   **Goal:** Prevent "Integration Hell."
*   **Process:** Commit -> Lint -> Compile/Build -> Unit Test -> Static Analysis.
*   **Rule:** The build must never be broken. If it breaks, fixing it is the priority.

### 2. Continuous Delivery vs. Continuous Deployment
*   **Continuous Delivery:** Code is automatically built, tested, and prepared for release to production. **Human intervention** is required to push the "Deploy" button.
*   **Continuous Deployment:** If code passes all automated tests, it is deployed to production **automatically** without human intervention.

### 3. Deployment Strategies
*   **Blue/Green:** Two identical environments. Traffic is switched from Blue (current) to Green (new) instantly. Easy rollback.
*   **Canary:** Rolling out the update to a small subset of users (e.g., 5%) before a full rollout.
*   **Rolling:** Updating instances one by one (or in batches) to ensure zero downtime.

## 📚 Recommended Reading
*   *Continuous Delivery* by Jez Humble & David Farley
*   *Release It!* by Michael T. Nygard