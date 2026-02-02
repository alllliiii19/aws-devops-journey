# OverTheWire Bandit Walkthrough (Levels 0–10)

## Why This Approach?

This activity began while watching a stand-up comedy video, where Bandit appeared as a suggestion in my YouTube recommendations. Curious about this Linux wargame, I visited the official website and started attempting levels.

What initially felt like a casual experiment became engaging enough to continue consistently. Each challenge requires direct interaction with the system, encouraging exploration, problem-solving, and practical command-line usage rather than passive learning.

The structured yet exploratory nature makes it both enjoyable and educational, reinforcing Linux fundamentals through real interaction.

---

## How This Started

Honestly? **At midnight**. I was bored, had free time, and decided to "just try a few levels for fun." Somewhere between fighting weird filenames and digging through directories, it stopped feeling like practice and started feeling like **play**.

I realized I actually enjoy **messing with systems**—poking around, breaking assumptions, and figuring things out the hard way. That curiosity turned this from a casual activity into something worth documenting.

This file is both a learning log and proof that real skills often grow out of curiosity, not pressure.

---

## What is Bandit?

Bandit is a beginner-friendly Linux wargame hosted by OverTheWire. Each level teaches core Linux concepts: file handling, permissions, hidden files, encoding, compression, and basic networking.

---

## Environment Details

- **OS**: Linux
- **Access Method**: SSH
- **Host**: bandit.labs.overthewire.org
- **Port**: 2220

---

## Level 0 → Level 1: Basic SSH Login

**Goal**: Read the password in `readme`

```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
cat readme
```

**Concepts**: SSH login, file listing, file reading

---

## Level 1 → Level 2: Special Filenames

**Goal**: Read a file named `-`

```bash
cat ./-
```

**Concepts**: Special filenames, relative paths

---

## Level 2 → Level 3: Spaces in Filenames

**Goal**: Read a file with spaces in its name

```bash
cat ./--spaces\ in\ my\ filename
```

**Concepts**: Escaping spaces, relative paths

---

## Level 3 → Level 4: Hidden Files

**Goal**: Find a hidden file in `inhere`

```bash
ls -a inhere/
cat inhere/.hidden
```

**Concepts**: Hidden files, `ls -a`

---

## Level 4 → Level 5: File Type Identification

**Goal**: Find the human-readable file

```bash
file inhere/*
cat inhere/-file07
```

**Concepts**: `file` command, ASCII detection

---

## Level 5 → Level 6: Advanced File Search

**Goal**: Find a file (1033 bytes, not executable)

```bash
find . -type f -size 1033c ! -executable
```

**Concepts**: `find` command, size filters, permission filtering

---

## Level 6 → Level 7: File Ownership

**Goal**: Find a file owned by `bandit7:bandit6`

```bash
find / -user bandit7 -group bandit6 2>/dev/null
```

**Concepts**: File ownership, system-wide search, error redirection

---

## Level 7 → Level 8: Text Searching

**Goal**: Find the password next to "millionth"

```bash
grep millionth data.txt
```

**Concepts**: `grep` command

---

## Level 8 → Level 9: Unique Line Detection

**Goal**: Find the unique (non-repeating) line

```bash
sort data.txt | uniq -u
```

**Concepts**: Sorting, `uniq` command

---

## Level 9 → Level 10: String Extraction

**Goal**: Find readable strings preceded by `=` in a binary file

```bash
strings data.txt | grep "="
```

**Concepts**: `strings` command, piping

---

## Key Skills Gained

- SSH login and remote access
- File navigation and permissions
- Text processing (`grep`, `sort`, `uniq`, `strings`)
- Command chaining and redirection
- System-wide file searching

---

**Status**: ✅ Levels 0–10 Completed

