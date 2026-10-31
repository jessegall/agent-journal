---
name: ProcessesArchitecture
description: Load it before writing code in the processes module of version 5 or in the Go runner, so every shell line runs through the one runner, the folder format has one owner and a rule only answers.
summary: Only RunnerRewrite rewrites a shell line, only OutputFolder knows the files of a run's folder, the runner reports through the journal client and never to the database, a processes rule runs and writes nothing itself, and the hook holds each program's rewritten input in the program table.
tier: mandatory
languages: [python, go]
---

# The processes architecture

A shell line of a main agent or a worker runs through `journal-run`, which keeps the run's files; the module keeps the rows.

## When it fires

- **`shell-input-rewritten-outside-the-runner-rule`** - a rule other than `RunnerRewrite` calls `RuleAnswer.rewritten`.
  Only that rule gives a shell line a new input; the others answer with lines or a refusal.
- **`process-folder-layout-outside-output-folder`** - Python names `heartbeat`, `run.sh`, `<n>.out` or `<n>.status`
  outside `support/output_folder.py`. Read and write a run's files through `OutputFolder`.
- **`runner-reaches-the-database`** - a file of `tools/journal-run` imports `database/sql` or a SQLite driver. The
  runner reports through the journal client: `process part-end`, `process end`, `process background`, `process lose`.
- **`process-rule-runs-or-writes`** - a rule in `processes/rules/` runs a shell, a command or a write itself. A rule
  answers; the commands it wants go in its answer with `running()`.
- **`go-updated-input-shape-outside-programs`** - Go outside `journal-hook/programs` writes `run_in_background`. What a
  program's rewritten input carries is in its row of the program table.
