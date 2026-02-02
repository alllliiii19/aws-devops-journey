# CentOS Stream 9 Setup on Ubuntu using VirtualBox & Vagrant

This repository documents the complete process of setting up CentOS Stream 9 on an Ubuntu host system using Oracle VirtualBox and Vagrant, including real-world errors, troubleshooting steps, and practical insights gained during the setup.

The goal of this project is to understand virtualization, Infrastructure as Code (IaC), and DevOps-style VM provisioning on Linux systems.

## 📌 Project Overview

| Component | Details |
|-----------|---------|
| Host OS | Ubuntu Linux |
| Hypervisor | Oracle VirtualBox |
| Automation Tool | Vagrant |
| Guest OS | CentOS Stream 9 |
| Provisioning Style | Infrastructure as Code |
| VM Type | Headless (CLI-based) |

## 🎯 Objectives

- Install and configure VirtualBox on Ubuntu
- Use Vagrant to automate CentOS Stream 9 VM creation
- Configure VM networking (NAT, Host-Only, Bridged)
- Understand Vagrantfile structure
- Troubleshoot common virtualization issues on Linux
- Follow DevOps-oriented best practices

## 🧠 Background Concepts

### VirtualBox
VirtualBox is a Type-2 hypervisor that allows running multiple operating systems on a single host using hardware virtualization (Intel VT-x / AMD-V).

### Vagrant
Vagrant is a tool that automates VM lifecycle management using declarative configuration files called Vagrantfiles. It enables reproducible environments and aligns with Infrastructure as Code principles.

### CentOS Stream
CentOS Stream is a rolling-release Linux distribution that serves as the upstream development platform for Red Hat Enterprise Linux (RHEL).

## 🖥️ System Requirements

### Hardware
- 64-bit CPU with virtualization support enabled
- Minimum 8 GB RAM
- At least 40 GB free disk space

### Software
- Ubuntu Linux (Host)
- Oracle VirtualBox
- Vagrant
- CentOS Stream 9 (Vagrant box)

## 🔧 Installation Steps

### 1. Install VirtualBox on Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install wget gnupg2 software-properties-common apt-transport-https -y
sudo apt install virtualbox-7.0
```

**Verify:**
```bash
virtualbox
```

### 2. Install Vagrant

```bash
sudo apt install vagrant -y
```

**Verify:**
```bash
vagrant --version
```

## 📂 Project Structure

```
centos-vm/
└── myvms/
    ├── Vagrantfile
    └── README.md
```

## 🧾 Vagrantfile Configuration

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "centos/stream9"

  # Host-only network with static IP
  config.vm.network "private_network", ip: "192.168.56.17"

  # Bridged network (asks user to select interface)
  config.vm.network "public_network", bridge: true

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    vb.cpus = 2
  end
end
```

## 🌐 Networking Explanation

| Network Type | Purpose |
|--------------|---------|
| NAT | Internet access |
| Host-Only | Host ↔ VM communication |
| Bridged | VM appears as a device on LAN |

> **⚠️ Important:** VirtualBox restricts host-only networks to `192.168.56.0/21`. Using IPs outside this range will result in errors.

## 🚀 Starting the Virtual Machine

```bash
cd ~/centos-vm/myvms
vagrant up
```

When prompted, select the appropriate network interface (Wi-Fi or Ethernet).

## 🔐 Accessing the VM

```bash
vagrant ssh
```

**Verify OS:**
```bash
cat /etc/os-release
```

## ❌ Errors Encountered & Fixes

### 1. VT-x / KVM Conflict

**Error:** `VT-x is being used by another hypervisor`

**Cause:** Linux loads KVM by default, which conflicts with VirtualBox.

**Fix:**
```bash
sudo modprobe -r kvm_intel
sudo modprobe -r kvm
```

### 2. Invalid Host-Only IP Range

**Error:** `IP address not within allowed ranges`

**Fix:** Use IP within `192.168.56.0 – 192.168.63.255`.

### 3. VirtualBox Guest Additions Failure

**Issue:** Guest Additions failed to compile on CentOS Stream 9 due to kernel incompatibility.

**Key Insight:** Guest Additions are not mandatory for Vagrant-based DevOps workflows.

**Resolution:** Manual Guest Additions installation was avoided. The VM was used in headless mode, which reflects real production server environments.

## 📌 Useful Vagrant Commands

```bash
vagrant up              # Start VM
vagrant ssh             # Login to VM
vagrant halt            # Stop VM
vagrant reload          # Restart VM with config changes
vagrant destroy         # Delete VM
vagrant status          # VM state
vagrant global-status   # List all Vagrant VMs
```

## 🧠 Key Learnings

- VirtualBox and KVM cannot run simultaneously
- Vagrant simplifies VM provisioning using code
- Networking misconfiguration is a common failure point
- Guest Additions are optional in headless environments
- EL9 kernels are strict with third-party kernel modules
- DevOps environments prioritize automation over GUI

## ✅ Final Outcome

- ✓ CentOS Stream 9 VM successfully deployed
- ✓ SSH access verified
- ✓ Networking functional
- ✓ DevOps-oriented VM environment achieved
- ✓ Infrastructure as Code workflow implemented
