---
name: WorkersArchitecture
description: Load it before changing the coding suite's workers module, so every git call of a worker's worktree stays in WorktreeGit, under a time limit, on the worktree's own branches, and never moves a checkout.
summary: Git runs only in WorktreeGit, each call with a timeout; no checkout HEAD is read and no folder is checked out or switched; a merge or rebase names the worktree's branches; guards read rows only.
tier: mandatory
languages: [python]
---

# The workers architecture

The workers module (doc 1101) cuts a worktree from the environment's branch, commits at delivery, rebases onto
and merges into that branch, and removes the worktree. Version 4 merged into whatever branch the checkout
happened to be on; these rules keep that fault from coming back.

## When it fires

- **`git-outside-worktree-git`** - a subprocess call runs `git` outside `WorktreeGit`
  (`src/suites/coding/modules/workers/support/worktree_git.py`). Add the step to `WorktreeGit`, with its time
  limit, and call that method from the handler.
- **`checkout-head-read`** - the module writes `--abbrev-ref`, `checkout` or `switch`. Read the branch from the
  worktree row (`base_branch`, `branch`); the merge refuses, with nothing moved, while the checkout is on another
  branch, and the main agent is reminded each hour.
- **`merge-names-a-literal-branch`** - a `merge` or `rebase` call names `HEAD` or a branch written in the code.
  Rebase onto `worktree.base_branch` and merge `worktree.branch`, both read from the row.
- **`git-call-without-time-limit`** - a subprocess call in `WorktreeGit` passes no `timeout=`. Pass
  `GIT_LIMIT_SECONDS`, or `CHECKOUT_LIMIT_SECONDS` for a call that checks files out.
- **`guard-runs-git`** - a workers guard calls a subprocess or `WorktreeGit`. A guard reads rows only; a check
  that needs git runs in the handler before any row changes, as `MergeWorkerHandler.check` reads the checkout's
  branch.

## Example

```python
# refused: git outside WorktreeGit, and a rebase onto HEAD
subprocess.run(["git", "-C", worktree.folder, "rebase", "HEAD"])

# the fix: one WorktreeGit step, timed, on the row's branch
self.git.rebase(worktree)
```
