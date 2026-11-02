---
name: journal-workers
description: Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one
---

# Workers

A subagent only reads. A worker writes, in a worktree of its own, on one task whose brief is its whole prompt.

## As the one who sends

- `journal worker dispatch <task>` starts a worker on the task. `--library-link <folder>` links a folder such as
  `.venv` into its worktree and `--library-copy <folder>` copies it. `--program <program>` names the agent program.
- `journal worker models` lists each program's models from the cheapest to the strongest.
- A worker that reported takes its next job with `journal worker send <n> "<job>"`, with its memory of the last. Send
  related work to the worker that knows it; never start a new one on work another already knows.
- Read each proof with `journal proof list --task <n>`, check it with `journal proof check <n>` or send it back with
  `journal proof short <n> "<what is missing>"`.
- Take the work in with `journal worker merge <worker>` once every point is checked; nothing else adds a worker's work.
- `journal worker release <worker> "<why>"` puts its task back to open.

## As the worker

- `journal proof points --agent <n>` lists the points of your task's brief.
- Prove each one with `journal proof make <point> "<file:line, and the test>"`.
- `journal worker deliver` hands your task in, with a proof for every point.
- Git is not yours to run: the journal commits your work.
