---
name: ProvidersArchitecture
description: Load it before writing an agent program's provider, a module that adds one, or code that differs by agent program in version 5, so everything about one program stays in its provider and its row of the program table.
summary: A provider only speaks its program's language; it decides nothing and runs nothing; only a provider module compares a program's name; a program's module depends on no other module.
tier: mandatory
languages: [python]
---

# The providers architecture

Version 5 adds an agent program, such as Claude Code or Codex, as a module with one provider (doc 1100). The
provider knows the program's files, hook names, command lines and transcripts; the drivers decide what the agent
may do, and the launcher runs the program. That only holds while each piece keeps to its place.

## When it fires

- **`provider-decides-what-an-agent-may-do`** - a provider imports a guard, a driver rule, `RuleAnswer` or
  `HookReply`. What the agent may do is decided by the drivers and guards; the provider only reads and writes
  its program's files and lines.
- **`provider-runs-a-program`** - a provider imports `subprocess`, `multiprocessing` or `pty`. A provider builds
  the command line as a `LaunchCommand`; the launcher runs it.
- **`program-name-compared-outside-its-provider`** - code in `src/core` or `src/server` outside the Claude Code and
  Codex modules compares a program's name, `event.program == "claude"`. Ask the program's provider through
  `Providers.provider(program)` for what differs.
- **`provider-in-a-dependent-module`** - a module that declares `dependencies` also declares `providers`. Give the
  program a module of its own with no dependencies, so it is added or removed on its own.
- **`hook-compared-by-a-string`** - code in `src/core` or `src/server` compares a hook event with a string,
  `event.event == "stop"`. Compare with its member, `event.event is HookEventName.STOP`.
