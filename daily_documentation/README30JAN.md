# Advanced Git Operations & GitOps Workflows

## Overview
This session focused on advanced Git operations and GitOps-style workflows using real repositories. The work moved beyond basic commits into structured branch management, feature isolation, remote configuration, SSH authentication, merge conflict resolution, and disaster recovery.

## Tools & Technologies
- **Version Control:** Git
- **Remote Hosting:** GitHub
- **Shell:** Linux Terminal / Bash
- **Editors:** vim, nano
- **Authentication:** SSH keys
- **Workflow:** Sprint branching + feature branching

## Branching Strategy
Implemented a sprint-based model with feature isolation:

```bash
git branch sprint1                    # Create sprint branch
git checkout sprint1                  # Switch branch
git switch -c feature-x               # Create & switch in one step
git branch -a                         # List all branches
```

## Merge & Conflict Resolution
Performed bidirectional merges to maintain synchronization:

```bash
git merge master                      # Bring master into sprint
git merge sprint1                     # Merge sprint into master
git status                            # Detect conflicts
git add file && git commit -m "resolved"  # Finalize merge
```

## Remote Configuration
```bash
git remote add origin <URL>           # Attach remote
git remote set-url origin <URL>       # Update existing remote
git push -u origin master             # Set upstream tracking
git remote -v                         # Verify remotes
```

## SSH Authentication
Migrated from HTTPS to SSH for secure authentication:

```bash
ssh -T git@github.com                 # Test SSH connection
git remote set-url origin git@github.com:user/repo.git
```

## Disaster Recovery
Tested Git recovery mechanisms:

```bash
git restore .                         # Restore all tracked files
git restore --source sprint1 file.txt # Restore from branch
```

## History & Inspection
```bash
git log --oneline                     # Compact history
git diff                              # Unstaged changes
git diff --cached                     # Staged changes
git diff commitA..commitB             # Compare commits
```

## Rollback Operations
```bash
git revert HEAD                       # Safe rollback (new commit)
git reset --hard                      # Hard reset (discard changes)
```

## Configuration
```bash
git config --global user.name "alllliiii19"
git config --global user.email "hadialiabbascse65@gmail.com"
```

