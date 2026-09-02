---
title: worktrees share the journal: .journal in a linked worktree is a symlink to the main checkout's, never a copy
track: session-scoped runtime
at: 2026-09-02T11:17:32+00:00
session: a926a873-bbe7-43a7-baba-958131aff937.jsonl
line: 1678
started: 2026-09-02T11:19:10+00:00
done: 2026-09-02T11:24:37+00:00
how: closed with the work of the same name
asks: 
answer: 
doc: 
---

The user's words: when creating a worktree, the journal folder must be symlinked and not
copied. A git checkout of a linked worktree copies the committed .journal/, and two
journals then drift.

Plan: at SessionStart (and in the CLI), detect a linked worktree: `git rev-parse
--git-common-dir` differs from the root's .git, so the main checkout is the common
dir's parent. If .journal here is a plain directory and identical to what is committed
(git status --porcelain .journal empty), replace it with a symlink to
<main>/.journal and say so once. If it is dirty, do not delete: redirect ROOT to the
main checkout's .journal for this session and warn that the copy should be removed.
Either way every read and write lands in one record. Also: `journal worktree link`
to do it by hand, and the README/skill say it. Cover the orchestrator's own worktree
creation (EnterWorktree / git worktree add by the agent) with the same SessionStart
path, since a new session starts in the worktree.
