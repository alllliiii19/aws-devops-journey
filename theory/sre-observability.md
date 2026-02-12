# Observability & Site Reliability Engineering (SRE)

## 📖 Introduction
"SRE is what happens when you ask a software engineer to design an operations team." It focuses on reliability and treating operations as a software problem.

## 🧠 Key Concepts

### 1. Monitoring vs. Observability
*   **Monitoring:** Tells you *when* something is wrong based on known unknowns (Dashboard lights). "Is the system healthy?"
*   **Observability:** Tells you *why* something is wrong based on unknown unknowns. "Can I understand the internal state of the system by looking at external outputs?"

### 2. The Three Pillars of Observability
1.  **Logs:** A discrete record of an event (Something happened at time X).
2.  **Metrics:** Aggregatable numerical data (CPU usage, Requests per second).
3.  **Traces:** The lifecycle of a request as it flows through various microservices (Distributed Tracing).

### 3. SRE Measurement Metrics
*   **SLI (Service Level Indicator):** The actual number (e.g., Latency is 200ms).
*   **SLO (Service Level Objective):** The goal (e.g., Latency should be < 300ms 99% of the time).
*   **SLA (Service Level Agreement):** The contract (e.g., If latency is > 300ms, we owe the customer money).
*   **Error Budget:** The amount of unreliability you are allowed before you must stop releasing new features and focus on stability.

## 📚 Recommended Reading
*   *Site Reliability Engineering* (The Google Book)
*   *Observability Engineering* by Charity Majors