# Hooks: the core and the domain dependencies

Plan 2 built the agent stack state machine of doc 3. Since task 96 it lives in the core, `app/Core`, with the agent and session context (`app/Core/Agents`) and the links every model uses (`app/Core/Links`). The core is a foundation under the domains, not a domain: every domain and every module installed later, ours, a paid one or a third party, uses it without declaring it, registers its own state types, pushes its own states and adds context. The core names no domain or module; `tests/Architecture/DomainBoundaryTest.php` scans `app/Core` and fails on any domain name in it.

Question 10 had approved edges from the domains to Hooks, Agents and Links. With those three in the core the edges are gone, and the only declared edge left is below. Rule 9 still holds: a domain declares a new required domain only after the user approves it. `tests/Unit/Domains/DomainClassesTest.php` lists every domain's requirements.

## Declared dependencies

| Domain | Requires | Why | Status |
|---|---|---|---|
| Plans | Tasks | a plan's phases hold tasks | approved (plan 1) |

The core's own needs from a domain go through contracts the core owns: Processes fills the core's `ShellCommandParser` with its shell parser.

## Owner stores the plan had to create

No owner store existed for the subjects the states are about, so plan 2 built the first, minimal one of each in its own domain, holding only what the stack needs. Later plans extend these stores; they do not add second ones.

| Domain | Store | Built in |
|---|---|---|
| Tasks | `tasks`, `Task`: title, state, run number, the agent and session working on it | task 62 |
| Chat | `messages`, `Message`: body, state, the agent and session that owe an answer | task 63 |
| Sequences | `sequence_runs`, `SequenceRun`: steps, current step, state, the agent and session | task 64 |
| Processes | `HookCommandFacts`: the shell parser and the command catalog; `saved_commands`, `SavedCommand` | tasks 65, 91 |
| Core (Agents) | `agents`, `agent_sessions`, `launch_credentials` and the launch, loss and child operations | tasks 57, 70, 72 |
| Memory | `memories`, `memory_compactions`: weights faded once per compaction | task 71 |
| Rules | `rules`, `Rule`: text and state | task 71 |
| Links | `links`, `Link`, `Linkable` | task 84 |

## Owner work still missing

| Missing | Owner and files | Follow-up |
|---|---|---|
| Starting a program with the relay environment (JOURNAL_URL, JOURNAL_LAUNCH_TOKEN, JOURNAL_ROLE, JOURNAL_BYPASS_LOG) | the host that launches programs; `bin/journal-hook` and `hooks:relay` exist (task 88) | task 89 |
| Captured fixtures from pinned program versions, the Codex settings shape and child identity | Hooks; `tests/Fixtures/Hooks/ClaudeCode`, `tests/Fixtures/Hooks/Codex`, `docs/hooks/program-capabilities.md` | task 89 |
| Agent scoping (rule 4) on the new task, message, sequence, memory and rule stores | Tasks, Chat, Sequences, Memory, Rules models | task 92 |
| A full hook call and a lock wait measured on the live Octane app | Hooks; `docs/hooks/program-capabilities.md` | task 93 |
