# Study Log - February 05, 2026

## 📚 Topics Covered Today

### Linux System Administration Fundamentals

---

## ✅ Completed Topics

### 1. VirtualBox Setup on Ubuntu
- [x] Installed VirtualBox on Ubuntu host
- [x] Resolved KVM conflicts (disabled KVM modules)
- [x] Created CentOS Stream 9 VM manually
- [x] Created Ubuntu 22.04 Server VM manually
- [x] Configured bridged networking for VMs
- [x] Successfully SSH'd into both VMs

**Key Learning:**
- VirtualBox and KVM cannot run simultaneously
- Bridged networking allows VMs to get IP addresses on local network
- Manual VM setup process includes: ISO attachment, network configuration, installation

---

### 2. Vagrant Setup and Configuration
- [x] Installed Vagrant from HashiCorp repository
- [x] Learned Vagrant workflow vs manual VM creation
- [x] Created Vagrantfile configurations
- [x] Understood vagrant commands (up, halt, destroy, ssh)

**Key Commands Learned:**
```bash
vagrant up          # Start VM
vagrant ssh         # Connect to VM
vagrant halt        # Stop VM
vagrant destroy     # Delete VM
vagrant status      # Check status
```

**Key Concepts:**
- Vagrant automates VM creation
- Vagrantfile = configuration as code
- Box = pre-built VM image
- Much faster than manual setup

---

### 3. Linux Filtering Commands
- [x] grep - Search text in files
- [x] less & more - File readers
- [x] head & tail - View file portions
- [x] cut - Extract columns from files
- [x] awk - Advanced text processing
- [x] sed - Search and replace

**Practical Examples Learned:**
```bash
# Case-insensitive search
grep -i "firewall" file.txt

# Recursive search in directories
grep -iR "SELINUX" /etc/*

# Monitor logs in real-time
tail -f /var/log/messages

# Extract usernames from passwd file
cut -d':' -f1 /etc/passwd

# Search and replace
sed -i 's/old/new/g' file.txt
```

**Real-world Application:**
- Finding configuration files without knowing exact location
- Monitoring system logs for troubleshooting
- Extracting specific data from structured files

---

### 4. Input/Output Redirection
- [x] Standard output redirection (>)
- [x] Append redirection (>>)
- [x] Error redirection (2>)
- [x] Combined redirection (&>)
- [x] /dev/null usage

**Key Concepts:**
```bash
# Overwrite file
command > file.txt

# Append to file
command >> file.txt

# Redirect errors
command 2> error.log

# Redirect everything
command &> all.log

# Discard output
command > /dev/null

# Clear file content
cat /dev/null > file.txt
```

**Practical Use Case:**
- Created system info report combining multiple commands
- Learned to separate output and errors for better debugging
- Understood log file generation by background processes

---

### 5. Piping
- [x] Connecting commands with pipe (|)
- [x] Chaining multiple commands
- [x] Filtering command outputs

**Examples Practiced:**
```bash
# Count files in directory
ls | wc -l

# Search in command output
ls | grep "host"

# Filter memory info
free -m | grep Mem

# Get last 20 log lines and search
tail -20 /var/log/messages | grep "vagrant"
```

**Understanding:**
- Pipe passes output of one command as input to another
- Very powerful for data processing
- Essential for shell scripting

---

### 6. Finding Files
- [x] find command (real-time search)
- [x] locate command (database search)
- [x] Difference between find and locate

**Commands Learned:**
```bash
# Find by name
find /etc -name "host*"

# Locate (faster but needs update)
locate host

# Update locate database
updatedb
```

**Key Difference:**
- find = slower but real-time
- locate = faster but needs updatedb

---

### 7. Users and Groups Management
- [x] Understanding user types (root, regular, system)
- [x] User management commands
- [x] Group management commands
- [x] Important files: /etc/passwd, /etc/shadow, /etc/group

**User Types Learned:**
1. **Root User:** UID=0, full system access
2. **Regular Users:** UID≥1000, normal login users
3. **System Users:** UID=1-999, service accounts, no login shell

**Commands Practiced:**
```bash
# User operations
useradd ansible
passwd ansible
userdel -r jenkins
id ansible

# Group operations
groupadd devops
usermod -aG devops ansible
groupdel devops

# Switching users
su - ansible
whoami
last
who
```

**File Formats Understood:**
```
/etc/passwd format:
username:x:UID:GID:comment:home:shell

Example:
vagrant:x:1000:1000:vagrant:/home/vagrant:/bin/bash
```

---

### 8. File Permissions
- [x] Reading permission notation (rwx)
- [x] Understanding user/group/others
- [x] Symbolic method (chmod u+x)
- [x] Numeric method (chmod 755)
- [x] Changing ownership (chown)

**Permission Structure:**
```
- rwx r-x r-x
│ │   │   └── Others
│ │   └────── Group  
│ └────────── Owner/User
└──────────── File type
```

**Permission Values:**
- r (read) = 4
- w (write) = 2
- x (execute) = 1

**Common Permissions:**
```bash
chmod 755  # rwxr-xr-x (scripts, directories)
chmod 644  # rw-r--r-- (regular files)
chmod 700  # rwx------ (private files)
chmod 770  # rwxrwx--- (team shared directory)
```

**Ownership Commands:**
```bash
# Change owner and group
chown ansible:devops /opt/project

# Recursive change
chown -R ansible:devops /opt/project
```

**Practical Scenario Completed:**
- Created shared directory for devops team
- Set proper ownership and permissions
- Tested access from different users
- Verified permissions work as expected

---

### 9. Sudo Configuration
- [x] Understanding sudo purpose
- [x] Editing sudoers file safely
- [x] Using visudo command
- [x] Creating files in /etc/sudoers.d/
- [x] NOPASSWD configuration

**Key Concepts:**
- Sudo = temporary root privileges for normal users
- Never edit /etc/sudoers directly with vim
- Always use `visudo` (checks syntax)
- Better: Create files in /etc/sudoers.d/

**Configuration Methods:**

**Method 1 - visudo:**
```bash
visudo
# Add: ansible ALL=(ALL) NOPASSWD: ALL
```

**Method 2 - /etc/sudoers.d/ (Recommended):**
```bash
# For user
echo "ansible ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/ansible

# For group (note the %)
echo "%devops ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/devops
```

**Tested:**
- Gave ansible user sudo access
- Configured NOPASSWD for automation
- Tested sudo -i and sudo commands
- Verified access works correctly

---

## 🎯 Key Takeaways

1. **Filtering is Essential:** System admins use grep, sed, awk daily to find configs and troubleshoot
2. **Piping is Powerful:** Combining commands with pipes enables complex operations
3. **Permissions Matter:** Proper ownership and permissions = security and functionality
4. **Sudo Best Practices:** Use /etc/sudoers.d/ directory, not main sudoers file
5. **Real-time Monitoring:** tail -f is crucial for log analysis and troubleshooting

---

## 💡 Important Tips Learned

### System Administration Tricks:
1. **Finding unknown config files:**
   ```bash
   grep -R "SETTING_NAME" /etc/*
   ```

2. **Monitoring logs while testing:**
   ```bash
   tail -f /var/log/messages
   # Make changes in another terminal
   # See events in real-time
   ```

3. **Creating system reports:**
   ```bash
   date > report.txt
   uptime >> report.txt
   free -m >> report.txt
   df -h >> report.txt
   ```

4. **Safe permission changes:**
   - Always test in safe directory first
   - Be very careful with -R (recursive)
   - Can't easily undo recursive changes

5. **User access troubleshooting:**
   ```bash
   lsof -u username  # See what files user has open
   ```

---

## ⚠️ Common Mistakes to Avoid

❌ **Don't do:**
- Edit /etc/sudoers with vim (use visudo)
- Give 777 permissions (major security risk)
- Run chmod -R without testing first
- Forget to run updatedb before locate
- Use root for everything

✅ **Always do:**
- Use visudo or /etc/sudoers.d/
- Give minimum necessary permissions
- Test commands in safe environment first
- Update locate database regularly
- Use sudo only when needed

---

## 🔧 Technical Issues Resolved Today

### Issue 1: VirtualBox "VMX root mode" Error
**Problem:** VirtualBox couldn't start VMs - KVM conflict

**Solution:**
```bash
sudo modprobe -r kvm_intel
sudo modprobe -r kvm
echo "blacklist kvm" | sudo tee -a /etc/modprobe.d/blacklist-kvm.conf
echo "blacklist kvm_intel" | sudo tee -a /etc/modprobe.d/blacklist-kvm.conf
sudo update-initramfs -u
sudo reboot
```

**Lesson:** VirtualBox and KVM cannot run simultaneously on Ubuntu

---

### Issue 2: VM Shows "Aborted" Status
**Problem:** VM wouldn't start, showed "System program problem detected"

**Root Cause:** USB controller conflicts and KVM modules

**Solution:** 
1. Disabled KVM modules (see above)
2. Unchecked USB controller in VM settings
3. Increased video memory to 128MB

**Result:** VM started successfully

---

## 📝 Practice Exercises Completed

### Exercise 1: User and Group Management
✅ Created users: ansible, jenkins, aws  
✅ Created group: devops  
✅ Added users to group using usermod  
✅ Added users to group by editing /etc/group  
✅ Set passwords for users  
✅ Verified with id command  
✅ Tested user switching with su  

### Exercise 2: File Permissions
✅ Created /opt/devopsdir  
✅ Set ownership to ansible:devops  
✅ Set permissions 770 (rwxrwx---)  
✅ Tested access as ansible user (success)  
✅ Tested access as aws user (success - in devops group)  
✅ Tested access as miles user (denied - not in group)  

### Exercise 3: Sudo Configuration
✅ Used visudo to add ansible to sudoers  
✅ Configured NOPASSWD for ansible  
✅ Created /etc/sudoers.d/devops for group access  
✅ Tested sudo -i from ansible user  
✅ Tested sudo commands without password  

### Exercise 4: Filtering Practice
✅ Used grep to find SELINUX config in /etc/  
✅ Extracted usernames from /etc/passwd with cut  
✅ Used awk to print specific columns  
✅ Performed search and replace with sed  
✅ Monitored logs with tail -f  
✅ Piped commands together for complex operations  

---

## 🚀 Next Steps

### To Practice:
- [ ] Create more complex Vagrantfiles with multiple VMs
- [ ] Write bash scripts using pipes and filters
- [ ] Set up more complex permission scenarios
- [ ] Practice log analysis with real application logs
- [ ] Create automated system monitoring scripts

### To Learn Next:
- [ ] Bash scripting fundamentals
- [ ] Advanced text processing (regex)
- [ ] System monitoring tools
- [ ] Package management in depth
- [ ] Network configuration
- [ ] Service management (systemd)
- [ ] Cron jobs and scheduling

---

## 📊 Study Statistics

**Date:** February 05, 2026  
**Duration:** Full day  
**Topics Covered:** 9 major topics  
**Commands Learned:** 50+ commands  
**Exercises Completed:** 4 practical exercises  
**Technical Issues Resolved:** 2  
**VMs Created:** 2 (CentOS + Ubuntu)  

---

## 💭 Personal Notes

### What Went Well:
- Successfully set up VirtualBox environment on Ubuntu
- Resolved KVM conflict independently
- All filtering and redirection concepts are clear
- Permission system makes perfect sense now
- Vagrant seems much easier than manual setup

### Challenges Faced:
- Initial KVM conflict was confusing
- Understanding numeric permissions took some time
- Remembering when to use -R flag with recursive operations

### Key Insights:
- System administration is about knowing WHERE to look, not memorizing everything
- grep -R is incredibly powerful for finding configs
- tail -f is essential for real-time troubleshooting
- Proper permissions = security + functionality
- Vagrant will save tons of time for future practice

---

## 📚 Resources Used

1. VirtualBox Documentation
2. Vagrant Documentation  
3. Linux man pages (man chmod, man grep, etc.)
4. Course transcripts on filtering, users, permissions, sudo
5. /etc/passwd, /etc/group, /etc/sudoers files

---

## ✍️ Review Checklist

Before moving to next topic, I can:

- [x] Create and manage VMs in VirtualBox
- [x] Use Vagrant to automate VM creation
- [x] Search for text in files using grep
- [x] Redirect output and errors to files
- [x] Chain commands together with pipes
- [x] Find files using find and locate
- [x] Create and manage users and groups
- [x] Understand and modify file permissions (symbolic + numeric)
- [x] Configure sudo access safely
- [x] Monitor logs in real-time
- [x] Extract data from structured files
- [x] Perform search and replace operations

**Status:** ✅ Ready to move forward!

---

## 🎓 Study Session Summary

Today was highly productive! Started with VirtualBox setup, hit a major roadblock with KVM conflicts, but successfully resolved it. Learned the entire workflow of manual VM creation, then discovered Vagrant's automation capabilities. 

The filtering, redirection, and piping concepts are fundamental and will be used constantly. User management and permissions are now crystal clear - the combination of ownership + mode controls access perfectly.

Most importantly, learned practical system administration techniques:
- Finding configs without knowing exact locations
- Real-time log monitoring for troubleshooting  
- Creating system reports with redirection
- Setting up shared team directories
- Giving users necessary privileges safely

**Confidence Level:** High ⭐⭐⭐⭐⭐

Ready for bash scripting and more advanced topics!

---

**Study Log Created:** February 05, 2026  
**Next Session:** Bash Scripting Fundamentals

---

*"The best way to learn Linux is by doing, not just reading."*