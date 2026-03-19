# VProfile Project — Complete Manual Provisioning Guide

> **Windows / macOS Intel | Multi-VM Stack | Every Command, Every Error, Every Fix**

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [VM Setup with Vagrant](#vm-setup-with-vagrant)
- [Service 1 — MySQL / MariaDB (db01)](#service-1--mysql--mariadb-db01)
- [Service 2 — Memcached (mc01)](#service-2--memcached-mc01)
- [Service 3 — RabbitMQ (rmq01)](#service-3--rabbitmq-rmq01)
- [Service 4 — Tomcat + Application Build (app01)](#service-4--tomcat--application-build-app01)
- [Service 5 — Nginx (web01)](#service-5--nginx-web01)
- [Validation & Testing](#validation--testing)
- [Common Errors & Fixes](#common-errors--fixes)
- [Key Concepts](#key-concepts)
- [Full Command Cheatsheet](#full-command-cheatsheet)

---

## Project Overview

VProfile is a multi-tier Java web application deployed manually across **5 virtual machines**. No Docker, no automation — every service is installed, configured, and connected by hand. The goal is to deeply understand how real enterprise stacks are assembled.

### Services

| # | Service | VM | Role |
|---|---------|-----|------|
| 1 | MySQL / MariaDB | db01 | SQL Database |
| 2 | Memcached | mc01 | DB Caching Layer |
| 3 | RabbitMQ | rmq01 | Message Broker / Queue |
| 4 | Tomcat 10 | app01 | Java Application Server |
| 5 | Nginx | web01 | Reverse Proxy / Load Balancer |

> **Note:** ElasticSearch is skipped in this setup — it requires too much RAM for local VMs.

---

## Architecture

```
Browser
   |
   v
[Nginx - web01 :80]          <-- Ubuntu VM, faces the user
   |
   v
[Tomcat - app01 :8080]       <-- CentOS 9, runs the Java app
   |
   |-----> [MariaDB - db01 :3306]     CentOS 9
   |-----> [Memcached - mc01 :11211]  CentOS 9
   |-----> [RabbitMQ - rmq01 :5672]   CentOS 9
```

### Setup Order (CRITICAL)

Always provision in this order. The application tries to connect to all backends on startup — they must exist first.

```
1. MySQL      (db01)  — data layer
2. Memcached  (mc01)  — cache layer
3. RabbitMQ   (rmq01) — messaging layer
4. Tomcat     (app01) — application layer
5. Nginx      (web01) — web/proxy layer
```

> **Shutdown order is the reverse:** Nginx → Tomcat → RabbitMQ → Memcached → MySQL

---

## Prerequisites

### Required Software

- [Oracle VM VirtualBox](https://www.virtualbox.org/) — hypervisor
- [Vagrant](https://www.vagrantup.com/) — VM management CLI
- Git Bash (Windows) or Terminal (macOS/Linux)

### Install Vagrant Host Manager Plugin

> **This is mandatory.** This plugin auto-populates `/etc/hosts` on every VM with hostname-to-IP mappings so services can reach each other by name (e.g. `app01`, `db01`).

```bash
vagrant plugin install vagrant-hostmanager
```

> ⚠️ **Run this ONCE on your host machine before anything else.** If skipped, VMs cannot resolve each other by hostname and all cross-service connections will fail.

### Clone the Source Code

```bash
# Clone the repo
git clone https://github.com/hkhcoder/vprofile-project.git

# Switch to the correct branch
# In VS Code: click branch name (bottom-left) → select origin/local
# Or via CLI:
git checkout local
```

> ⚠️ **You MUST switch to the `local` branch.** The `main` branch does not contain the correct Vagrantfile or configs for this setup.

### Choose the Right Folder

| Your OS | Folder |
|---------|--------|
| Windows | `vagrant/Manual_provisioning` |
| macOS (Intel) | `vagrant/Manual_provisioning` |
| macOS (M1/M2/M3) | `vagrant/Manual_provisioning_MacOSM1` |
| Linux | `vagrant/Manual_provisioning` |

```bash
cd vprofile-project/vagrant/Manual_provisioning
```

---

## VM Setup with Vagrant

### 1. Clean Slate Check

```bash
# See all running vagrant VMs
vagrant global-status

# If any old VMs exist, destroy them first
cd /path/to/old/vm
vagrant destroy

# Remove stale entries
vagrant global-status --prune
```

### 2. Bring Up All VMs

```bash
# Make sure you're in the correct vagrant folder
vagrant up
```

This starts all 5 VMs: `db01`, `mc01`, `rmq01`, `app01`, `web01`. Takes several minutes.

> ⚠️ If `vagrant up` stops midway or times out — just run `vagrant up` again, or `vagrant reload` to reboot all VMs.

### 3. Verify /etc/hosts (Auto-populated by Plugin)

```bash
vagrant ssh web01
sudo -i
cat /etc/hosts
```

You should see entries like:
```
192.168.56.15   db01
192.168.56.14   mc01
192.168.56.16   rmq01
192.168.56.12   app01
192.168.56.11   web01
```

```bash
# Test connectivity
ping app01 -c 4
ping db01 -c 4
```

> ⚠️ If ping fails for any VM — reboot it: `vagrant reload <vmname>`

### Vagrant Command Reference

| Command | What It Does |
|---------|-------------|
| `vagrant up` | Start all VMs |
| `vagrant halt` | Shut down all VMs |
| `vagrant reload` | Reboot all VMs |
| `vagrant reload db01` | Reboot only db01 |
| `vagrant ssh db01` | SSH into db01 |
| `vagrant destroy` | Delete all VMs permanently |
| `vagrant status` | Show VM states |
| `vagrant global-status --prune` | Clean stale entries |

---

## Service 1 — MySQL / MariaDB (db01)

### Login

```bash
vagrant ssh db01
sudo -i
```

### Install Packages

```bash
dnf update -y
dnf install epel-release -y
dnf install git mariadb-server -y
```

> **Note:** Package is `mariadb-server` but the service name is `mariadb`. Package names and service names often differ.

### Start & Enable

```bash
systemctl start mariadb
systemctl enable mariadb
systemctl status mariadb
```

### Run Secure Installation

```bash
mysql_secure_installation
```

Answer the prompts:

| Prompt | Answer |
|--------|--------|
| Enter current password for root | Press Enter (none yet) |
| Switch to unix_socket authentication | Press Enter (Y default) |
| Change the root password? | `Y` → set to `admin123` |
| Remove anonymous users? | `Y` |
| Disallow root login remotely? | `Y` |
| Remove test database? | `Y` |
| Reload privilege tables? | `Y` |

### Create Database & Application User

```bash
mysql -u root -padmin123
```

```sql
create database accounts;

-- Local access (from same server)
grant all privileges on accounts.* TO 'admin'@'localhost' identified by 'admin123';

-- Remote access (from app01/Tomcat)
grant all privileges on accounts.* TO 'admin'@'%' identified by 'admin123';

FLUSH PRIVILEGES;
exit;
```

> **Why two GRANT statements?** `@'localhost'` = local login. `@'%'` = remote login from any host (needed by Tomcat on app01).

### Initialize the Database Schema

```bash
cd /tmp/
git clone -b local https://github.com/hkhcoder/vprofile-project.git
cd vprofile-project

# Import the SQL schema
mysql -u root -padmin123 accounts < src/main/resources/db_backup.sql

# Verify tables were created
mysql -u root -padmin123 accounts
show tables;
exit;
```

### Restart MariaDB

```bash
systemctl restart mariadb
```

### Firewall Rules (Optional for local setup)

```bash
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --get-active-zones
firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --reload
systemctl restart mariadb
```

---

## Service 2 — Memcached (mc01)

### Login

```bash
vagrant ssh mc01
sudo -i
```

### Install Memcached

```bash
dnf update -y
dnf install epel-release -y
dnf install memcached -y
```

### Start & Enable

```bash
systemctl start memcached
systemctl enable memcached
systemctl status memcached
```

### Allow Remote Connections (Critical)

By default, Memcached only listens on `127.0.0.1` (localhost). Tomcat on `app01` connects **remotely**, so we must open it to all interfaces:

```bash
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/sysconfig/memcached

# Verify the change
cat /etc/sysconfig/memcached
# OPTIONS should now show: -l 0.0.0.0,::1
```

> ⚠️ **This is a very common failure point.** If skipped, Tomcat can ping mc01 but Memcached silently rejects the connection.

> **What does `sed` do here?**  
> `sed -i` = edit file in-place  
> `'s/old/new/g'` = substitute old with new, globally (all occurrences)  
> It rewrites the config without opening an editor.

### Restart Memcached

```bash
systemctl restart memcached
```

> **Rule:** Always restart a service after changing its config. The running process only reads config at startup.

### Final Command

```bash
memcached -p 11211 -U 11111 -u memcached -d
```

| Flag | Meaning |
|------|---------|
| `-p 11211` | TCP port |
| `-U 11111` | UDP port |
| `-u memcached` | Run as memcached OS user |
| `-d` | Run as daemon (background) |

### Firewall Rules (Optional)

```bash
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --add-port=11211/tcp
firewall-cmd --runtime-to-permanent
firewall-cmd --add-port=11111/udp
firewall-cmd --runtime-to-permanent
```

---

## Service 3 — RabbitMQ (rmq01)

### Login

```bash
vagrant ssh rmq01
sudo -i
```

### Install RabbitMQ

```bash
dnf update -y
dnf install epel-release -y
dnf install wget -y

# Install the CentOS RabbitMQ repository
dnf install centos-release-rabbitmq-38 -y

# Enable that repo and install rabbitmq-server from it
dnf --enablerepo=centos-rabbitmq-38 -y install rabbitmq-server

# Start and enable in one command
systemctl enable --now rabbitmq-server
```

> ⚠️ **TYPO ALERT:** Package is `centos-release-rabbitmq-38` — NOT `centos-release-rbbitmq-38`.  
> Missing letter **`a`**. If you get `No match for argument` — check your spelling.

### Configure RabbitMQ

```bash
# Remove loopback restriction so remote connections are allowed
sudo sh -c 'echo "[{rabbit, [{loopback_users, []}]}]." > /etc/rabbitmq/rabbitmq.config'
```

### Add Application User

```bash
# Create user 'test' with password 'test'
rabbitmqctl add_user test test

# Give it admin role
rabbitmqctl set_user_tags test administrator

# Grant full permissions on default virtual host
rabbitmqctl set_permissions -p / test ".*" ".*" ".*"
```

> This is the user defined in `application.properties` — username: `test`, password: `test`.

### Restart & Verify

```bash
systemctl restart rabbitmq-server
systemctl status rabbitmq-server
```

### Firewall Rules (Optional)

```bash
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --add-port=5672/tcp
firewall-cmd --runtime-to-permanent
```

---

## Service 4 — Tomcat + Application Build (app01)

This is the most complex step. It has two phases:
1. Install and configure Tomcat as a system service
2. Build the Java app with Maven and deploy it

### Login

```bash
vagrant ssh app01
sudo -i
```

---

### Phase 1 — Tomcat Setup

#### Install Dependencies

```bash
dnf update -y
dnf install epel-release -y
dnf -y install java-17-openjdk java-17-openjdk-devel
dnf install git wget -y
```

#### Download & Extract Tomcat 10

```bash
cd /tmp/

wget https://archive.apache.org/dist/tomcat/tomcat-10/v10.1.26/bin/apache-tomcat-10.1.26.tar.gz

tar xzvf apache-tomcat-10.1.26.tar.gz
```

> ⚠️ There is **no** `dnf install tomcat10`. Tomcat must be downloaded as a binary directly from Apache's archive.

#### Create Tomcat User & Home Directory

```bash
# Create user with home dir and no login shell (security best practice)
useradd --home-dir /usr/local/tomcat --shell /sbin/nologin tomcat

# Copy extracted files to home directory
cp -r /tmp/apache-tomcat-10.1.26/* /usr/local/tomcat/

# Give tomcat user full ownership
chown -R tomcat.tomcat /usr/local/tomcat
```

> ⚠️ **COPY-PASTE DANGER on `chown`:** If you paste this from a PDF or website, invisible Unicode characters sneak in and cause:  
> `chown: invalid option -- '?'`  
> **Always TYPE this command manually.**

#### Create systemd Service File

```bash
vi /etc/systemd/system/tomcat.service
```

Paste the following content:

```ini
[Unit]
Description=Tomcat
After=network.target

[Service]
User=tomcat
Group=tomcat
WorkingDirectory=/usr/local/tomcat
Environment=JAVA_HOME=/usr/lib/jvm/jre
Environment=CATALINA_PID=/var/tomcat/%i/run/tomcat.pid
Environment=CATALINA_HOME=/usr/local/tomcat
Environment=CATALINA_BASE=/usr/local/tomcat
ExecStart=/usr/local/tomcat/bin/catalina.sh run
ExecStop=/usr/local/tomcat/bin/shutdown.sh
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Enable & Start Tomcat

```bash
# MANDATORY after creating/modifying any .service file
systemctl daemon-reload

systemctl start tomcat
systemctl enable tomcat
systemctl status tomcat
```

> **`systemctl daemon-reload` is mandatory** after any `.service` file change. Without it, systemctl uses the old version still in memory.

#### Firewall Rules (Optional)

```bash
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --get-active-zones
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload
```

---

### Phase 2 — Maven Build & Deployment

#### Download Maven

```bash
cd /tmp/

wget https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip

unzip apache-maven-3.9.9-bin.zip

cp -r apache-maven-3.9.9 /usr/local/maven3.9

# Prevent out-of-memory errors during build
export MAVEN_OPTS="-Xmx512m"
```

> **Why `MAVEN_OPTS`?** Our VMs have very limited RAM. This variable caps Maven's memory request at 512MB — preventing it from crashing on low-memory machines.

#### Clone Source Code

```bash
cd /tmp/
git clone -b local https://github.com/hkhcoder/vprofile-project.git
cd vprofile-project
```

#### Review application.properties

```bash
vim src/main/resources/application.properties
```

Verify these values match your setup:

```properties
# Database
jdbc.url=jdbc:mysql://db01:3306/accounts?useUnicode=true&...
jdbc.username=admin
jdbc.password=admin123

# Memcached
memcached.active.host=mc01
memcached.active.port=11211

# RabbitMQ
rabbitmq.address=rmq01
rabbitmq.port=5672
rabbitmq.username=test
rabbitmq.password=test
```

> **No changes needed** if you followed this guide exactly. These hostnames resolve via `/etc/hosts` (populated by vagrant-hostmanager).

> ⚠️ If you used different passwords or usernames during setup — **update this file to match.** Mismatch = app fails to connect to backends.

#### Build the Application

```bash
# Run from inside the vprofile-project directory
/usr/local/maven3.9/bin/mvn install
```

Maven compiles the source code and packages it into a `.war` file. This takes several minutes. When complete you'll see `BUILD SUCCESS`.

```bash
ls target/
# You should see: vprofile-v2.war
```

#### Deploy Artifact to Tomcat

```bash
# Stop Tomcat before deploying
systemctl stop tomcat

# Remove the default Tomcat ROOT application
rm -rf /usr/local/tomcat/webapps/ROOT*

# Copy our artifact as ROOT.war (makes it the default app)
cp target/vprofile-v2.war /usr/local/tomcat/webapps/ROOT.war

# Start Tomcat — it auto-extracts ROOT.war into ROOT/
systemctl start tomcat

# Fix ownership on extracted files
chown -R tomcat.tomcat /usr/local/tomcat/webapps

# Restart for clean state
systemctl restart tomcat
systemctl status tomcat
```

> **Why `ROOT.war`?** Tomcat serves applications from `webapps/`. An app named `ROOT` becomes the default app at `/`. Any other name would require a URL path like `/vprofile`.

> ⚠️ **Type `chown` manually — do not paste from a PDF.**

---

## Service 5 — Nginx (web01)

> **web01 runs Ubuntu** — not CentOS. Use `apt` instead of `dnf`.

### Login

```bash
vagrant ssh web01
sudo -i
```

### Update OS & Install Nginx

```bash
# apt update = refresh package list (no changes)
# apt upgrade = actually apply updates
apt update && apt upgrade -y

apt install nginx -y
```

### Create Virtual Host Config

```bash
vi /etc/nginx/sites-available/vproapp
```

Type the following content **manually** (do NOT paste from browser/PDF — hidden characters break nginx):

```nginx
upstream vproapp {
    server app01:8080;
}

server {
    listen 80;

    location / {
        proxy_pass http://vproapp;
    }
}
```

> ⚠️ The name in `upstream vproapp {}` **must exactly match** `proxy_pass http://vproapp`.  
> Even one character difference causes: `host not found in upstream`

### Enable the Site

```bash
# Remove the default nginx welcome page
rm -rf /etc/nginx/sites-enabled/default

# Symlink our config into sites-enabled to activate it
ln -s /etc/nginx/sites-available/vproapp /etc/nginx/sites-enabled/vproapp
```

> **How nginx site activation works:** `sites-available/` stores config files. `sites-enabled/` contains symlinks to active configs. This pattern lets you enable/disable sites without deleting files.

### Test Config & Restart

```bash
# ALWAYS test before restarting
nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

systemctl restart nginx
systemctl status nginx
```

> **Always run `nginx -t` before restarting.** It tells you exactly which file and line number has an error.

---

## Validation & Testing

### Find the Nginx IP

```bash
# On your host machine:
vagrant ssh web01
ip addr show
# Look for the 192.168.56.x address
```

### Access the Application

Open a browser on your host machine:

```
http://192.168.56.11
```

You should see the VProfile login page.
- Username: `admin`
- Password: `admin123`

### Service Status Checks

```bash
# Run each on the respective VM
systemctl status mariadb          # on db01
systemctl status memcached        # on mc01
systemctl status rabbitmq-server  # on rmq01
systemctl status tomcat           # on app01
systemctl status nginx            # on web01
```

### Verify DB Schema

```bash
# On db01
mysql -u root -padmin123 accounts -e 'show tables;'
```

### Verify Artifact Deployed

```bash
# On app01
ls /usr/local/tomcat/webapps/ROOT/
```

### Validate Nginx Config

```bash
# On web01
nginx -t
```

---

## Common Errors & Fixes

### Error 1 — `chown: invalid option` (Hidden Character)

```
chown: invalid option -- '?'
```

**Cause:** Invisible Unicode character pasted from a PDF or webpage.  
**Fix:** Type the command manually — do not paste:

```bash
chown -R tomcat.tomcat /usr/local/tomcat/webapps
```

---

### Error 2 — `host not found in upstream "vproapp"`

```
nginx: [emerg] host not found in upstream "vproapp"
```

**Cause 1:** Typo in upstream name — e.g. `vroapp` vs `vproapp`  
**Fix 1:** Check your config:

```bash
cat -n /etc/nginx/sites-available/vproapp
# upstream name on line 1 must match proxy_pass name exactly
```

**Cause 2:** `app01` not in `/etc/hosts`  
**Fix 2:**

```bash
cat /etc/hosts | grep app01
# If missing:
echo "192.168.56.12 app01" >> /etc/hosts
```

---

### Error 3 — nginx `unknown directive ""`

```
nginx: [emerg] unknown directive "" in /etc/nginx/sites-enabled/vproapp:2
```

**Cause:** Invisible Unicode/UTF-8 character at start of line from copy-paste.  
**Detect:**

```bash
cat -A /etc/nginx/sites-available/vproapp
# Look for ^M or ^@ characters
```

**Fix:** Delete the file and retype it manually:

```bash
rm /etc/nginx/sites-available/vproapp
nano /etc/nginx/sites-available/vproapp
# Type the upstream + server block manually
```

---

### Error 4 — RabbitMQ Package Not Found

```
No match for argument: centos-release-rbbitmq-38
```

**Cause:** Typo — `rbbitmq` instead of `rabbitmq` (missing letter `a`).  
**Fix:**

```bash
dnf install centos-release-rabbitmq-38 -y
#                          ^^^
#                       rabbitmq (not rbbitmq)
```

---

### Error 5 — MySQL `database exists`

```
ERROR 1007: Can't create database 'accounts'; database exists
```

**Cause:** Database was already created in a previous attempt.  
**Fix:**

```sql
drop database accounts;
create database accounts;
```

> ⚠️ Dropping deletes all data. Only do this during initial setup.

---

### Error 6 — `show database` SQL Syntax Error

```
ERROR 1064: near 'database' at line 1
```

**Cause:** Wrong command — `database` is singular, needs to be plural.  
**Fix:**

```sql
show databases;
--          ^
--          needs the 's'
```

---

### Error 7 — `sed: No such file or directory`

```
sed: can't read /etc/sysconfig/memcached: No such file or directory
```

**Cause:** Missing leading `/` — typed `etc/sysconfig/...` instead of `/etc/sysconfig/...`  
**Fix:**

```bash
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/sysconfig/memcached
#                               ^
#                          must start with /
```

---

### Error 8 — Tomcat Starts But App Not Accessible

**Cause 1:** `ROOT.war` not copied correctly  
**Cause 2:** Wrong file ownership — Tomcat can't read the files  
**Cause 3:** `application.properties` has wrong backend hostnames/passwords  

**Fix:**

```bash
# Check artifact exists
ls /usr/local/tomcat/webapps/ROOT/

# Fix ownership
chown -R tomcat.tomcat /usr/local/tomcat/webapps

# Check application config
cat /tmp/vprofile-project/src/main/resources/application.properties
```

---

### Error 9 — VM Timeout / Doesn't Boot

```
Timed out while waiting for the machine to boot.
```

**Fix:**

```bash
vagrant reload <vmname>
# or
vagrant up
```

---

## Key Concepts

### Why This Specific Setup Order?

Tomcat reads `application.properties` at startup and immediately tries to connect to all backends. If MariaDB isn't running yet, Tomcat fails to initialize. Always provision backends before the application layer.

### What is 0.0.0.0?

In networking, `0.0.0.0` means "all interfaces" — the service accepts connections from any IP. `127.0.0.1` means "loopback only" — the service rejects all remote connections. Any service that needs to accept traffic from another machine must not be bound to `127.0.0.1`.

### What Does vagrant-hostmanager Do?

It writes `/etc/hosts` entries on every VM so they can resolve each other by hostname. Without it, `db01`, `mc01` etc. are unresolvable strings. The plugin makes all hostname-based configs work automatically — which is why it's installed before anything else.

### What is a .war File?

WAR = Web Application Archive. A ZIP file containing a compiled Java web app. Tomcat deploys a WAR by extracting it into `webapps/`. Naming it `ROOT.war` makes it the default application served at `/`.

### What is Maven?

Maven is a Java build tool. `mvn install` reads `pom.xml`, downloads dependencies, compiles source code, runs tests, and packages everything into a `.war` file. The output is the deployable artifact.

### What is a Reverse Proxy?

Nginx here acts as a reverse proxy. Users connect to Nginx on port 80. Nginx forwards those requests to Tomcat on port 8080. Users never reach Tomcat directly. Benefits: clean URL, security, SSL termination, and load balancing capability.

### What Does `sed` Do?

`sed` = Stream Editor. It reads text, transforms it, and outputs the result.

```bash
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/sysconfig/memcached
#   ^   ^                    ^
#   |   substitute command   global (all occurrences)
#   edit in-place (save to file)
```

---

## Full Command Cheatsheet

### Host Machine

```bash
vagrant plugin install vagrant-hostmanager
vagrant up
vagrant halt
vagrant reload
vagrant ssh <vmname>
vagrant destroy
vagrant status
vagrant global-status --prune
```

### db01 — MariaDB

```bash
vagrant ssh db01 && sudo -i
dnf update -y
dnf install epel-release -y
dnf install git mariadb-server -y
systemctl start mariadb && systemctl enable mariadb
mysql_secure_installation
mysql -u root -padmin123
  create database accounts;
  grant all privileges on accounts.* TO 'admin'@'localhost' identified by 'admin123';
  grant all privileges on accounts.* TO 'admin'@'%' identified by 'admin123';
  FLUSH PRIVILEGES;
  exit;
cd /tmp/ && git clone -b local https://github.com/hkhcoder/vprofile-project.git
mysql -u root -padmin123 accounts < /tmp/vprofile-project/src/main/resources/db_backup.sql
systemctl restart mariadb
```

### mc01 — Memcached

```bash
vagrant ssh mc01 && sudo -i
dnf update -y
dnf install epel-release -y && dnf install memcached -y
systemctl start memcached && systemctl enable memcached
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/sysconfig/memcached
systemctl restart memcached
memcached -p 11211 -U 11111 -u memcached -d
```

### rmq01 — RabbitMQ

```bash
vagrant ssh rmq01 && sudo -i
dnf update -y
dnf install epel-release -y && dnf install wget -y
dnf install centos-release-rabbitmq-38 -y
dnf --enablerepo=centos-rabbitmq-38 -y install rabbitmq-server
systemctl enable --now rabbitmq-server
sudo sh -c 'echo "[{rabbit, [{loopback_users, []}]}]." > /etc/rabbitmq/rabbitmq.config'
rabbitmqctl add_user test test
rabbitmqctl set_user_tags test administrator
rabbitmqctl set_permissions -p / test ".*" ".*" ".*"
systemctl restart rabbitmq-server
```

### app01 — Tomcat

```bash
vagrant ssh app01 && sudo -i
dnf update -y
dnf install epel-release -y
dnf -y install java-17-openjdk java-17-openjdk-devel
dnf install git wget -y
cd /tmp/
wget https://archive.apache.org/dist/tomcat/tomcat-10/v10.1.26/bin/apache-tomcat-10.1.26.tar.gz
tar xzvf apache-tomcat-10.1.26.tar.gz
useradd --home-dir /usr/local/tomcat --shell /sbin/nologin tomcat
cp -r /tmp/apache-tomcat-10.1.26/* /usr/local/tomcat/
chown -R tomcat.tomcat /usr/local/tomcat
vi /etc/systemd/system/tomcat.service    # paste service file
systemctl daemon-reload
systemctl start tomcat && systemctl enable tomcat
```

### app01 — Maven Build & Deploy

```bash
cd /tmp/
wget https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip
unzip apache-maven-3.9.9-bin.zip
cp -r apache-maven-3.9.9 /usr/local/maven3.9
export MAVEN_OPTS="-Xmx512m"
git clone -b local https://github.com/hkhcoder/vprofile-project.git
cd vprofile-project
vim src/main/resources/application.properties    # verify backend settings
/usr/local/maven3.9/bin/mvn install
systemctl stop tomcat
rm -rf /usr/local/tomcat/webapps/ROOT*
cp target/vprofile-v2.war /usr/local/tomcat/webapps/ROOT.war
systemctl start tomcat
chown -R tomcat.tomcat /usr/local/tomcat/webapps
systemctl restart tomcat
```

### web01 — Nginx

```bash
vagrant ssh web01 && sudo -i
apt update && apt upgrade -y
apt install nginx -y
vi /etc/nginx/sites-available/vproapp    # type upstream + server block
rm -rf /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/vproapp /etc/nginx/sites-enabled/vproapp
nginx -t
systemctl restart nginx
```

---

*VProfile Project — Manual Provisioning Guide | hkhcoder/vprofile-project | branch: local*
