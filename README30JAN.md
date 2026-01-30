In this session, I focused on advanced Git operations and GitOps-style workflows using real repositories (aws-devops-journey and git_work). The objective was to move beyond basic commits and pushes into structured branch management, feature isolation, remote configuration, SSH authentication, merge conflict resolution, and repository recovery.

This work simulated real-world version control scenarios including branch drift, remote misconfiguration, accidental deletions, and conflict handling — and resolving them using proper Git commands and flags.

🛠️ Tools & Technologies Used

Version Control: Git
Remote Hosting: GitHub
Interface: Linux Terminal / Bash Shell
Editors: vim, nano
Authentication: SSH keys
Workflow Model: Sprint branching + feature branching

🌿 Branching & Development Strategy

I implemented a sprint-based branching model to separate development streams from the production branch.

Created a sprint branch from master

Created a feature branch (feature-x) for isolated feature work

Used branch switching and listing commands to manage flow

Commands used:

git branch sprint1 → create new branch
git checkout sprint1 → switch branch
git branch -a → list all branches (local + remote)
git switch -c feature-x → create & switch branch in one step

To keep the feature branch focused, I removed unrelated files using:

rm file → remove file
rm -rf folder → recursive forced directory removal

This demonstrated feature scoping and branch minimalism.

🔄 Merge & Conflict Resolution

I performed bidirectional merges between master and sprint branches to maintain synchronization and prevent branch drift.

git merge master → bring master changes into sprint
git merge sprint1 → merge sprint into master

During merging, a file rename caused a merge conflict.

Conflict resolution workflow:

git status → detect conflicted files
manual file edit → resolve markers
git add file → mark resolved
git commit -m "resolved" → finalize merge

Lesson: Git detects — engineer decides — Git records.

🌍 Remote Repository Configuration

I configured and troubleshot GitHub remotes across both repositories.

git remote add origin URL → attach remote
git remote -v → verify remote links

When duplicate origin errors appeared:

git remote set-url origin URL → overwrite existing remote

Push operations used upstream tracking:

git push -u origin master
git push -u origin sprint1

-u flag sets default upstream branch for future pushes.

🔐 SSH Authentication Migration

Initial HTTPS pushes failed due to credential and permission issues. I migrated remotes to SSH for secure authentication.

ssh -T git@github.com
 → test SSH authentication
git remote set-url origin git@github.com
:user/repo.git → switch protocol

Result:

No credential prompts

Secure key-based authentication

Stable push/pull operations

🧯 Disaster Recovery Exercises

I intentionally removed files and directories to test Git recovery mechanisms.

rm -rf project_files → simulated destructive deletion

Recovery methods:

git restore . → restore all tracked files to last commit
git restore --source sprint1 file.txt → restore file from another branch

Flag meaning:

--source → specify alternate branch snapshot for restore

This demonstrated Git as a snapshot recovery system, not just version tracking.

🔍 Change Tracking & History Inspection

I audited repository state using Git inspection tools.

git log → full commit history
git log --oneline → compact history view
git diff → unstaged changes
git diff --cached → staged vs last commit

Flag meaning:

--cached → compare staging area instead of working tree

I also compared commit ranges:

git diff commitA..commitB → change delta between two snapshots

↩️ Rollback & Reset Operations

Two rollback strategies were tested.

Safe rollback:

git revert HEAD → create reverse commit

Hard reset:

git reset --hard → reset working tree + staging to last commit

Flag meaning:

--hard → discard all uncommitted changes completely

🧰 Supporting Shell Commands Used

ls → list files
pwd → show directory path
mkdir → create directory
touch → create file
mv → move/rename file
cat → display file content
history >> gitcommands.txt → append command history to file

operator appends output instead of overwriting.

📝 Configuration Setup

Global Git identity configured:

git config --global user.name "alllliiii19"
git config --global user.email "hadialiabbascse65@gmail.com
"

--global flag applies settings across all repositories.

📸 Evidence & Artifacts

Branch structures created and merged

Feature branch isolation tested

SSH migration completed

Merge conflicts resolved

Deleted files restored from Git snapshots

Full command history exported to
