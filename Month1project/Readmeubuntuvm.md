
# Linux Server Management: Deploying a Dynamic WordPress Site

## 📄 Overview

### Essay: Mastering the LAMP Stack and Dynamic Content

Having successfully deployed a static site on CentOS, this project advances into dynamic web hosting. Unlike static sites that serve fixed HTML files, dynamic applications like WordPress generate content on the fly. This requires a "Stack"—a collection of software working in harmony.

In this lab, we utilized the LAMP Stack on Ubuntu 20.04. The complexity increases as we move beyond simple file copying to managing:

- **Web Server (Apache)**: Configuring Virtual Hosts to point to custom directories (`/srv/www/wordpress`)
- **Database (MySQL)**: Creating a dedicated environment for WordPress to store posts, users, and settings
- **Scripting Language (PHP)**: Enabling the server to process the WordPress engine
- **Application Logic**: Connecting the front-end (Apache) to the back-end (MySQL) via `wp-config.php` with unique Salt keys

This exercise prepares us for automating these complex steps using Vagrant provisioning in future sessions.

## 🏗 Project Workflow

1. **Ubuntu Provisioning**: Initialize Ubuntu 20.04 (Focal64) VM with 1.6GB RAM
2. **LAMP Installation**: Install Apache, MySQL, and PHP modules
3. **WordPress Setup**: Download and extract WordPress to `/srv/www/wordpress`
4. **Apache Configuration**: Configure virtual host and enable site
5. **Database Creation**: Initialize MySQL and create user with privileges
6. **Application Integration**: Configure `wp-config.php` with credentials and Salt keys
7. **Web Initialization**: Complete the WordPress installation via browser

## 📂 Folder Structure

```
F:/ (Work Drive)
└── vagrant-vms/
    └── wordpress/
        ├── Vagrantfile         # Ubuntu 20.04 (IP: 192.168.56.26)
        └── .vagrant/           # VM state files
```

**Key VM Paths:**
- Web Root: `/srv/www/wordpress`
- Apache Config: `/etc/apache2/sites-available/wordpress.conf`
- App Config: `/srv/www/wordpress/wp-config.php`

## 🛠 Implementation

### 1. VM Provisioning

```bash
mkdir wordpress && cd wordpress
vagrant init ubuntu/focal64
vagrant up
vagrant ssh
sudo -i
```

### 2. Dependency Installation

```bash
apt update
apt install apache2 ghostscript libapache2-mod-php mysql-server php php-bcmath php-curl php-imagick php-intl php-json php-mbstring php-mysql php-xml php-zip -y
```

### 3. Database Configuration

```sql
CREATE DATABASE wordpress;
CREATE USER 'wordpress'@'localhost' IDENTIFIED BY 'admin123';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER ON wordpress.* TO 'wordpress'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Apache Site Setup

**Create `/etc/apache2/sites-available/wordpress.conf`:**

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

**Enable configurations:**

```bash
a2ensite wordpress
a2enmod rewrite
a2dissite 000-default
systemctl restart apache2
```

### 5. WordPress Configuration

- Use `sed` to update database credentials in `wp-config.php`
- Replace Salt keys with values from the official WordPress API

## 🔍 Verification

- **URL**: `http://192.168.56.26`
- **Success**: WordPress Welcome screen appears

## 🧹 Cleanup

```bash
exit     # Exit root
exit     # Exit VM
vagrant destroy -f
```

---

| Property | Value |
|----------|-------|
| Topic | LAMP Stack & WordPress Deployment |
| OS | Ubuntu 20.04 |
| Database | MySQL |
| Application | WordPress (Dynamic Site) |
