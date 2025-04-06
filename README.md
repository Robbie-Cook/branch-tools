# Deprecated

This repository is deprecated. Please use git aliases instead for branch management.
You can add aliases to your `~/gitconfig` file to add common git commands. These are avaliable as `git <command>`.

Here's a collection of handy aliases:
```
[alias]
    # Cleans branches
    clean-branches = "!f() { \
        git branch --merged | egrep -v '(^\\*|main|develop)' | xargs git branch -d; \
    }; f"
    # Untested -- sync submodules
    sync-submodules = "!f() { \
        git submodule update --init --recursive; \
    }; f"
    
```


# Branch Tools

## Usage:

### Default

Run

```bash
npx branch-tools
```
from inside a git folder.

You will then be presented with a prompt to take you through what you want to do.

If you want to speed up the command, you can install branch-tools directly:
```bash
npm i branch-tools --save-dev
npx branch-tools
```

### Clean

> Cleans unneeded local branches

Run

```bash
npx branch-tools clean
```
from inside a git folder.

### Sync

> Syncs sub repos of a repository

Run

```bash
npx branch-tools sync
```
from inside a folder that *contains* git folders.

## Testing

To test this locally, clone this repo, and then run

```bash
node <path_to_package>/dist/src/bin/branch-tools.js
```
