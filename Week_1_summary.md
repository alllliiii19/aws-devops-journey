# 📅 Week 1: The Transition to Cloud Engineering

This repository documents my first week of intensive DevOps learning.

## 🧠 Days 1-6: The Mindset Shift
Over the last six days, I moved from treating Linux as a learning environment to treating it as a production system running inside Amazon’s datacenters.

### Key Technical Milestones
* **Infrastructure Provisioning:** Created and configured an AWS EC2 Ubuntu server.
* **Access Control:** Generated and protected SSH key pairs (`chmod 400`), learning the importance of strict file permissions and correct directory paths.
* **Network Security:** Exposed web services only after understanding that a running service is useless unless the **AWS Security Group** explicitly allows the traffic. This taught me that problems are often at the infrastructure boundary, not just inside the server.

### The Security Lesson (Fail2Ban vs. UFW)
Security became a major lesson. While trying to implement **Fail2Ban**, I experienced repeated failures caused by OS-level incompatibilities and broken sockets.
* **The Engineering Decision:** Instead of endlessly fighting a fragile toolchain, I learned a real principle—*when a control mechanism cannot be trusted, replace it.*
* **The Solution:** I removed Fail2Ban and implemented **SSH brute-force protection directly at the firewall level** using UFW rate limiting. This provided a more stable, kernel-enforced defense.
* **The Insight:** I discovered that localhost traffic bypasses firewall logic, teaching me that real security validation must come from external interfaces.

### The DevOps Workflow
I transitioned from running isolated commands to thinking in systems:
1.  **Code:** Written locally.
2.  **Version Control:** Pushed to GitHub.
3.  **Deployment:** Served through Nginx on a live server.
4.  **Monitoring:** Validating real production traffic.

> *"My perspective transformed from 'I installed Nginx' to 'I exposed port 80 through AWS Security Groups, deployed a web server on a hardened Ubuntu EC2 instance, and secured SSH with key-based authentication.'"*

---

## 🚀 Day 7: The Capstone Project ("StreamFlix")
**Objective:** Prove the knowledge by building a custom web application on the infrastructure provisioned during the week.

### What I Built
* Deployed **StreamFlix**, a custom HTML/CSS/JS web application.
* Configured **Nginx** to serve static assets efficiently.
* **Live Debugging:** encountered a critical "Connection Refused" error due to a typo in a CIDR block (`157.148` vs `157.48`), which I diagnosed and fixed using live logs (`tail -f`).

### Final Status
* **Infrastructure:** ✅ Live on AWS
* **Security:** ✅ UFW & Security Groups Active
* **Code:** ✅ Pushed to GitHub

---
*Week 1 Status: COMPLETED*