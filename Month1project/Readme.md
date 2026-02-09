Linux Server Management: Deploying the Bio Lume Biotechnology Site
📄 Overview
Essay: From Linux Basics to Professional Server Management
In the journey of mastering Linux, the transition from understanding basic commands to managing live server environments marks a significant milestone. This project documents the shift from foundational Linux knowledge—such as file systems, users, and permissions—to the practical application of server management. By manually provisioning, configuring, and deploying web services on CentOS, we establish a "hands-on" understanding of how infrastructure operates before moving toward cloud-scale automation.
The core of today's session focused on the standard lifecycle of server deployment: managing dependencies, controlling services with systemctl, and deploying external data. We transformed a blank CentOS 9 virtual machine into a functional web server hosting a professional Biotechnology template (Bio Lume). This manual process serves as the vital blueprint for future automation using Vagrant provisioning and complex application stacks like LAMP (Linux, Apache, MySQL, PHP). Mastering these steps manually ensures that when we eventually automate with scripts, we understand every moving part of the system.
🏗 Project Workflow
The deployment followed a structured 6-step lifecycle to ensure consistency and reliability:
Provisioning: Creating a localized virtual environment using Vagrant and VirtualBox to isolate the server environment.
Network Configuration: Setting a static IP (192.168.56.22) and updating the hostname to bio-lume for easy identification.
Dependency Installation: Installing the software stack required for a web server: httpd (Apache), wget (for fetching data), and unzip (for extracting compressed templates).
Service Management: Initializing the httpd process and using systemctl enable to ensure the website stays online even after a server reboot.
Data Deployment: Sourcing the Bio Lume Biotechnology template from Tooplate, transferring it to the server, and placing the assets into the web root directory (/var/www/html/).
Security Adjustment: Disabling the default firewall (firewalld) to ensure the web traffic can reach the server during this development phase.
📂 Folder Structure
The following directory structure was maintained on the host machine to organize the project:
code
Text
F:/ (Work Drive)
└── vagrant-vms/                # Main directory for all Linux labs
    └── bio-lume/               # Project folder for this specific site
        ├── Vagrantfile         # VM Configuration (CentOS 9, Static IP)
        └── .vagrant/           # (Hidden) Vagrant environment state
🛠 Step-by-Step Implementation
1. VM Initialization & Configuration
code
Bash
# Create and enter the directory
mkdir bio-lume && cd bio-lume

# Initialize the CentOS box
vagrant init eurolinux/centos-9-stream

# Edit Vagrantfile to set IP to 192.168.56.22 and RAM to 1024MB
vagrant up
vagrant ssh
sudo -i
2. Environment Setup
code
Bash
# Update hostname for identification
hostnamectl set-hostname bio-lume

# Install dependencies
yum install httpd wget vim unzip -y

# Start and enable the Web Server
systemctl start httpd
systemctl enable httpd

# Stop Firewall to allow web traffic
systemctl stop firewalld
systemctl disable firewalld
3. Bio Lume Template Deployment
code
Bash
# Navigate to temporary folder
cd /tmp

# Download the Bio Lume Biotechnology template
# (Link obtained via Brave Browser Developer Tools)
wget https://www.tooplate.com/zip-templates/2136_biolume.zip

# Unzip and move files to the web root
unzip 2136_biolume.zip
cd 2136_biolume
cp -r * /var/www/html/

# Restart httpd to apply changes
systemctl restart httpd
🔍 Verification
Service Status: systemctl status httpd (Should be active/running).
Web Access: Open browser to http://192.168.56.22.
Result: The Bio Lume Biotechnology website should be fully rendered and functional.
🧹 Cleanup
To free up system resources after the exercise:
code
Bash
exit     # Exit root
exit     # Exit VM
vagrant destroy -f
Topic: Linux Server Management & Static Site Deployment
Lab OS: CentOS 9
Web Service: Apache (httpd)
Template: Bio Lume (Biotechnology)