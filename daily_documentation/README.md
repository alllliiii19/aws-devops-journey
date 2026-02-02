# 🚀 Day 7: My First Cloud Deployment

## 📋 Project Overview
After 6 days of learning DevOps concepts and Linux fundamentals, I successfully deployed my first custom web application ("StreamFlix") to a live AWS EC2 server. This project moves away from theory into real-world infrastructure management.

## 🛠️ Tech Stack
* **Cloud Provider:** AWS (Amazon Web Services)
* **Compute:** EC2 (Ubuntu 24.04 LTS)
* **Web Server:** Nginx
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Security:** UFW Firewall, AWS Security Groups, SSH Key Management

## 🏗️ Architecture
* **Instance Type:** t2.micro (Free Tier)
* **Storage:** EBS (Elastic Block Store)
* **Networking:**
    * **Port 22 (SSH):** Secured for admin access.
    * **Port 80 (HTTP):** Open for public web traffic.

## 🚧 Challenges & Solutions

### 1. The "Connection Refused" Incident
* **The Issue:** While configuring the UFW firewall to block mobile traffic, I accidentally locked myself out or misconfigured the rule.
* **The Debug:**
    * I realized I typed `157.148.x.x` (Wrong Subnet) instead of `157.48.x.x` (My Phone's IP).
    * **Lesson:** One digit in a CIDR block changes the entire target. Precision is critical in security rules.

### 2. Permissions Hell
* **The Issue:** My SSH key had "too open" permissions (`0644`), causing AWS to reject the connection.
* **The Fix:** Ran `chmod 400 key.pem` to restrict access to read-only for the owner.

## 📸 Deployment Evidence
*(Upload your screenshot of the StreamFlix website here)*



![StreamFlix Website Preview](./images/Streamf-lix_app.png)











## 🔮 Next Steps (Week 2)
* Configuring a custom Domain Name (DNS).
* Enabling HTTPS with SSL Certificates.