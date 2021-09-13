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
