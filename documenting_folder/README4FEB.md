# DevOps Learning Journey

A comprehensive documentation of my DevOps learning path, covering virtualization, infrastructure automation, server management, programming fundamentals, and networking concepts.

## 📚 Table of Contents

- [Vagrant & Virtualization](#vagrant--virtualization)
- [Linux Server Management](#linux-server-management)
- [Programming Fundamentals](#programming-fundamentals)
- [Computer Networking](#computer-networking)
- [Key Takeaways](#key-takeaways)

---

## 🔧 Vagrant & Virtualization

### Overview
Learned advanced Vagrant concepts for VM automation and infrastructure provisioning, leveraging AI tools (GitHub Copilot) for enhanced productivity.

### Core Concepts Covered

#### 1. **Vagrantfile Structure**
- Configuration syntax using Ruby-based DSL
- Hash (`#`) for comments
- `config.vm.*` settings pattern
- Vagrant boxes from Vagrant Cloud

#### 2. **Networking Configuration**

**Bridged Adapter (Public Network)**
```ruby
config.vm.network "public_network"
```
- VM gets IP from router (DHCP)
- Accessible from local network

**Private Network (Static IP)**
```ruby
config.vm.network "private_network", ip: "192.168.56.17"
```
- Static IP assignment
- Host-only networking

#### 3. **Resource Allocation**
```ruby
config.vm.provider "virtualbox" do |vb|
  vb.memory = "1024"
  vb.cpus = 2
end
```

#### 4. **Synced Folders**
Default sync: `/vagrant` ↔ Host project directory

Custom sync:
```ruby
config.vm.synced_folder "./scripts", "/opt/scripts"
```

**Key Insight**: Files created in synced folders appear in both host and guest machines simultaneously.

#### 5. **Provisioning (Bootstrapping)**
Automates post-boot command execution:

```ruby
config.vm.provision "shell", inline: <<-SHELL
  yum install -y httpd wget unzip
  systemctl start httpd
  systemctl enable httpd
SHELL
```

**Important**: 
- Provisioning runs only on first `vagrant up`
- Re-run with `vagrant provision` or `vagrant reload --provision`

### Essential Vagrant Commands

| Command | Purpose |
|---------|---------|
| `vagrant up` | Create/start VM |
| `vagrant halt` | Graceful shutdown |
| `vagrant destroy` | Delete VM |
| `vagrant reload` | Reboot VM |
| `vagrant ssh` | SSH into VM |
| `vagrant status` | VM status in current directory |
| `vagrant global-status` | All VMs status |
| `vagrant global-status --prune` | Remove stale entries |

### AI-Assisted Workflow (GitHub Copilot)

**Setup in VS Code**:
1. Install Vagrantfile extension for syntax highlighting
2. Set default terminal: `Ctrl+Shift+P` → "Select Default Profile" → Git Bash (Windows)

**Key Features Used**:
- `/explain` - Understand configuration settings
- `/fix` - Automatically fix syntax errors
- `@terminal` - Get terminal commands
- Auto-completion for Vagrant settings

**Example Interaction**:
```
Ctrl+I → "Write Vagrantfile with box ubuntu/focal64, 
use virtualbox provider, memory 1GB, CPU 2, 
static IP 192.168.56.17"
```

---

## 🐧 Linux Server Management

### Project 1: HTML Website Deployment (CentOS)

**Objective**: Deploy a static HTML website using Apache HTTP Server

**Steps Executed**:

1. **VM Setup**
```bash
vagrant init eurolinux/centos-stream-9
# Edit Vagrantfile for network & resources
vagrant up
```

2. **Install Dependencies**
```bash
sudo yum install -y httpd wget vim unzip
```

3. **Service Management**
```bash
systemctl start httpd
systemctl enable httpd
systemctl status httpd
```

4. **Download & Deploy Template**
```bash
cd /tmp
wget <template-download-url>
unzip <template-file.zip>
cd <template-folder>
cp -r * /var/www/html/
systemctl restart httpd
```

5. **Firewall Configuration**
```bash
systemctl stop firewalld
systemctl disable firewalld
```

6. **Validation**
- Access via browser: `http://<VM-IP>`
- Check service status
- Verify content in `/var/www/html`

**Key Concept**: Document Root
- Apache serves files from `/var/www/html/`
- `index.html` is the default landing page

---

### Project 2: WordPress Deployment (Ubuntu LAMP Stack)

**LAMP Stack**: Linux + Apache + MySQL + PHP

**Complete Deployment Process**:

#### Phase 1: Install Dependencies
```bash
sudo apt update
sudo apt install -y apache2 \
    mysql-server \
    php libapache2-mod-php php-mysql \
    php-curl php-gd php-mbstring \
    php-xml php-xmlrpc php-soap php-intl php-zip
```

#### Phase 2: Install WordPress
```bash
sudo mkdir -p /srv/www
sudo chown www-data:www-data /srv/www
cd /srv/www
sudo -u www-data wget https://wordpress.org/latest.tar.gz
sudo -u www-data tar -xzf latest.tar.gz
```

#### Phase 3: Configure Apache
Create `/etc/apache2/sites-available/wordpress.conf`:
```apache
<VirtualHost *:80>
    DocumentRoot /srv/www/wordpress
    <Directory /srv/www/wordpress>
        Options FollowSymLinks
        AllowOverride Limit Options FileInfo
        DirectoryIndex index.php
        Require all granted
    </Directory>
</VirtualHost>
```

Enable site:
```bash
sudo a2ensite wordpress
sudo a2enmod rewrite
sudo a2dissite 000-default
sudo systemctl reload apache2
```

#### Phase 4: Database Setup
```sql
CREATE DATABASE wordpress;
CREATE USER 'wordpress'@'localhost' IDENTIFIED BY 'admin123';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER 
    ON wordpress.* TO 'wordpress'@'localhost';
FLUSH PRIVILEGES;
quit
```

#### Phase 5: WordPress Configuration
```bash
sudo -u www-data cp /srv/www/wordpress/wp-config-sample.php \
    /srv/www/wordpress/wp-config.php

# Update database credentials
sudo -u www-data sed -i 's/database_name_here/wordpress/' \
    /srv/www/wordpress/wp-config.php
sudo -u www-data sed -i 's/username_here/wordpress/' \
    /srv/www/wordpress/wp-config.php
sudo -u www-data sed -i 's/password_here/admin123/' \
    /srv/www/wordpress/wp-config.php
```

Update authentication keys from https://api.wordpress.org/secret-key/1.1/salt/

#### Phase 6: Access & Setup
- Browser: `http://<VM-IP>`
- Complete WordPress installation wizard

**Troubleshooting Checklist**:
- ✅ Database connection settings in `wp-config.php`
- ✅ Apache configuration syntax
- ✅ Service status: `systemctl status apache2 mysql`
- ✅ File permissions on `/srv/www/wordpress`

---

### Server Deployment Methodology

Standard 4-phase approach observed in both projects:

1. **Install Dependencies** - Required packages & libraries
2. **Service Management** - Start, enable, configure services
3. **Configuration Changes** - Edit config files, set parameters
4. **Deploy Data** - Copy application files, restart services

---

## 💻 Programming Fundamentals

### Bash Scripting Basics

**Variables**:
```bash
skill="DevOps"
echo $skill              # Output: DevOps
echo "Learning $skill"   # Output: Learning DevOps
echo 'Learning $skill'   # Output: Learning $skill (literal)
```

**Key Points**:
- No spaces around `=` in assignment
- `$` prefix to access variable value
- Double quotes preserve variable expansion
- Single quotes treat everything as literal

---

### Python Data Structures

#### 1. **Strings**
```python
skill = "DevOps"
print(skill)  # DevOps
```

#### 2. **Integers**
```python
year = 2023
print(year)  # 2023
```

#### 3. **Lists** (Ordered, Mutable)
```python
tools = ["Jenkins", "Docker", "Kubernetes", "Terraform", 90]
print(tools[0])      # Jenkins (index 0)
print(tools[-1])     # 90 (last element)
print(tools[1:4])    # ['Docker', 'Kubernetes', 'Terraform'] (slicing)
```

#### 4. **Tuples** (Ordered, Immutable)
```python
tools_tuple = ("Jenkins", "Docker", "Kubernetes")
print(tools_tuple[0])  # Jenkins
# Syntax difference: parentheses instead of square brackets
```

#### 5. **Dictionaries** (Key-Value Pairs)
```python
devops = {
    "skill": "DevOps",
    "year": 2023,
    "tech": {
        "Cloud": "AWS",
        "Containers": "K8s",
        "CICD": "Jenkins",
        "GitOps": ["GitLab", "ArgoCD", "Tekton"]
    }
}

print(devops["skill"])           # DevOps
print(devops["tech"]["Cloud"])   # AWS
print(devops["tech"]["GitOps"])  # ['GitLab', 'ArgoCD', 'Tekton']
```

**Nested Access**:
```python
# Access "ArgoCD" from nested structure
print(devops["tech"]["GitOps"][1])  # ArgoCD
```

---

### JSON Format

**Conversion from Python Dictionary**:

Python Dictionary:
```python
{"skill": "DevOps", "year": 2023, "tech": {"Cloud": "AWS"}}
```

Formatted JSON:
```json
{
  "skill": "DevOps",
  "year": 2023,
  "tech": {
    "Cloud": "AWS",
    "Containers": "K8s",
    "CICD": "Jenkins",
    "GitOps": [
      "GitLab",
      "ArgoCD",
      "Tekton"
    ]
  }
}
```

**Characteristics**:
- Curly braces `{}` for objects
- Square brackets `[]` for arrays
- Key-value pairs with colon `:`
- Comma-separated elements
- Primarily used for data exchange

---

### YAML Format

**Same Data in YAML**:
```yaml
skill: DevOps
year: 2023
tech:
  Cloud: AWS
  Containers: K8s
  CICD: Jenkins
  GitOps:
    - GitLab
    - ArgoCD
    - Tekton
```

**Key Syntax Rules**:
- **Indentation matters** (2 or 3 spaces consistently)
- Colon `:` for key-value pairs
- Space after colon required
- Hyphen `-` for list items
- No quotes needed (usually)
- No commas or brackets

**Why YAML?**
- More human-readable than JSON
- Cleaner syntax for configuration files
- Widely used in: Ansible, Kubernetes, Docker Compose, CI/CD pipelines

---

### DevOps Relevance

**Essential Skills**:
- ✅ **Read JSON**: API responses, configuration files
- ✅ **Write YAML**: Infrastructure as Code, playbooks, manifests
- ✅ **Understand data structures**: Manipulate configs, parse outputs

**Practice Tools**: Ansible (YAML-heavy), Kubernetes manifests, Terraform variables

---

## 🌐 Computer Networking

### Foundational Concepts

#### What is a Computer Network?
Communication between two or more network interfaces enabling data exchange between devices.

#### Essential Components
1. **Devices**: Computers, smartphones, IoT devices
2. **Cables/Wireless**: Physical/wireless medium
3. **Network Interfaces (NICs)**: Adapters on each device
4. **Switches**: Connect devices in a LAN
5. **Routers**: Connect multiple networks
6. **Operating Systems**: Process and present network data

---

### OSI Model (7 Layers)

The ISO-OSI model provides standardization for worldwide communication.

| Layer | Name | Function | Devices/Protocols |
|-------|------|----------|-------------------|
| **7** | Application | User interaction (browsers, apps) | HTTP, FTP, SMTP |
| **6** | Presentation | Data encryption, compression | SSL/TLS |
| **5** | Session | Session management | NetBIOS |
| **4** | Transport | End-to-end delivery, error recovery | TCP, UDP |
| **3** | Network | IP addressing, routing (packets) | Routers, IP |
| **2** | Data Link | MAC addressing, framing | Switches, MAC |
| **1** | Physical | Bit transmission over cables | Hubs, Cables |

**Data Transformation**:
- Layer 1: **Bits** (1s and 0s)
- Layer 2: **Frames** (MAC addresses)
- Layer 3: **Packets** (IP addresses)
- Layer 4: **Segments** (TCP/UDP)

**Key Principles**:
- Each layer provides **services** to the layer above
- Communication follows **protocols** (rules)
- **Interfaces** enable layer-to-layer communication

---

### Network Classification by Geography

| Type | Full Name | Description | Example |
|------|-----------|-------------|---------|
| **PAN** | Personal Area Network | Very small range | Bluetooth, hotspot |
| **LAN** | Local Area Network | Single building/room | Office network |
| **CAN** | Campus Area Network | Multiple buildings | College campus |
| **MAN** | Metropolitan Area Network | City-wide | Municipal networks |
| **WAN** | Wide Area Network | Global/country-wide | Internet |

---

### Network Devices

#### Switch (Layer 2)
- Connects multiple devices in a LAN
- Forwards traffic based on **MAC addresses**
- Intelligent forwarding to specific ports

#### Router (Layer 3)
- Connects multiple networks together
- Routes traffic based on **IP addresses**
- Provides Internet connectivity (NAT)

#### Home Network Setup
```
Internet → Modem → Router (with built-in switch) → Access Point → Devices
                        ↓
                    Switch (optional)
                        ↓
                Computers/Phones/IoT
```

**Corporate Network**:
- Multiple switches for redundancy
- Multiple routers for different ISPs
- Firewalls for security
- Multiple subnets for organization

---

### IP Addressing (IPv4)

#### Structure
- **32-bit binary number** (shown in decimal)
- Format: `192.168.100.1`
- Four **octets** (8 bits each)
- Range: `0.0.0.0` to `255.255.255.255`

**Why 255?**
- Binary: `11111111` (8 ones) = 255 in decimal

---

#### Private vs Public IPs

**Public IPs**:
- Used on the Internet
- Assigned by ISPs & cloud providers
- Your identity on the Internet

**Private IP Ranges** (RFC 1918):

| Class | Range | Example | Usage |
|-------|-------|---------|-------|
| **Class A** | 10.0.0.0 - 10.255.255.255 | 10.10.5.20 | Large networks |
| **Class B** | 172.16.0.0 - 172.31.255.255 | 172.20.19.68 | Medium networks |
| **Class C** | 192.168.0.0 - 192.168.255.255 | 192.168.1.100 | Small networks (home) |

**Identifying IP Class**:
```
192.168.0.174    → Class C (192.168.x.x)
172.20.19.68     → Class B (172.16-31.x.x)
10.10.5.20       → Class A (10.x.x.x)
172.32.36.87     → Public IP (outside private ranges)
```

---

### Subnets

**Subnet** = Part of a network, smaller logical division

**Use Cases**:
- Separate database servers from web servers
- Isolate different projects/departments
- Improve security and traffic management

**Practice Opportunity**: AWS VPC configuration (mentioned in course roadmap)

---

## 🎯 Key Takeaways

### Technical Skills Acquired

1. **Infrastructure Automation**
   - Vagrant for VM provisioning
   - Declarative configuration with Vagrantfile
   - AI-assisted infrastructure coding

2. **Linux System Administration**
   - Package management (yum/apt)
   - Service management (systemctl)
   - Web server deployment (Apache/httpd)
   - Database administration (MySQL)

3. **Programming Foundations**
   - Shell scripting basics
   - Python data structures
   - JSON/YAML parsing and creation

4. **Networking Fundamentals**
   - OSI model comprehension
   - IP addressing and subnetting
   - Network device functions
   - Home/corporate network architecture

---

### DevOps Mindset Developed

✅ **Automation First**: Manual setup → Provisioning scripts  
✅ **Documentation**: Proper config file management  
✅ **Troubleshooting**: Systematic debugging approach  
✅ **Tool Leverage**: AI assistance for productivity  
✅ **Standards Adherence**: Following industry best practices

---

### Next Steps in Learning Path

Based on course progression mentioned:

- [ ] **Bash Scripting** (deep dive)
- [ ] **Python Programming** (advanced)
- [ ] **AWS VPC & Networking**
- [ ] **Docker & Containerization**
- [ ] **Kubernetes Orchestration**
- [ ] **CI/CD Pipelines**
- [ ] **Infrastructure as Code** (Terraform/Ansible)

---

## 📝 Practice Exercises Completed

### Vagrant
- ✅ Created multi-VM setup with custom networking
- ✅ Implemented synced folders for code sharing
- ✅ Automated provisioning scripts for web servers

### Linux
- ✅ Deployed HTML template on CentOS (httpd)
- ✅ Set up LAMP stack on Ubuntu
- ✅ Configured WordPress with database integration

### Programming
- ✅ Bash variable manipulation
- ✅ Python dictionary/list operations
- ✅ JSON ↔ YAML conversion practice

---

## 🛠️ Tools & Technologies

| Category | Tools Used |
|----------|------------|
| **Virtualization** | VirtualBox, VMware Desktop, Vagrant |
| **Operating Systems** | CentOS Stream 9, Ubuntu 20.04 |
| **Web Servers** | Apache HTTP Server (httpd/apache2) |
| **Databases** | MySQL Server |
| **Languages** | Bash, Python, Ruby (Vagrantfile) |
| **Data Formats** | JSON, YAML |
| **Editors** | VS Code, Vim, Nano |
| **AI Tools** | GitHub Copilot |
| **Terminals** | Git Bash (Windows), Terminal (macOS) |

---

## 📖 Resources Referenced

- **Vagrant Cloud**: Pre-built VM boxes
- **Tooplate.com**: Free HTML templates
- **Ubuntu Documentation**: WordPress installation guide
- **DigitalOcean Tutorials**: Server setup guides
- **Online Editors**: Programiz (Python), JSON/YAML validators

---

## 🏆 Professional Development

This learning journey has built foundational competencies for:

- **Cloud Engineering**: AWS/Azure infrastructure setup
- **Site Reliability Engineering**: Service deployment & monitoring
- **DevOps Engineering**: CI/CD pipeline development
- **System Administration**: Linux server management
- **Platform Engineering**: Container orchestration

---

## 📅 Study Timeline

**Date**: February 4, 2026  
**Format**: Video transcripts from comprehensive DevOps course  
**Topics Covered**: 9 major sections spanning virtualization to networking

---

## 💡 Key Insights

> "You need to know what you are doing. AI is going to help you, but we need to have an upper hand always. We cannot completely rely on the AI tools."

This wisdom emphasizes the importance of understanding fundamentals before leveraging automation and AI assistance.

---

## 🔗 Related Documentation

*This README will be expanded as I progress through:*
- AWS sections
- Docker & Kubernetes modules
- Ansible automation
- CI/CD pipeline implementations

---

**Last Updated**: February 4, 2026  
**Status**: Foundations Complete ✅  
**Next**: Bash Scripting Deep Dive