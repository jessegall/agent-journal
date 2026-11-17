# Hooks: domain dependencies and owner work

Plan 2 built the agent stack state machine of doc 3 in the Hooks domain (`app/Domain/Hooks`). Rule 9 says a domain declares a new required domain only after the user approves it. Question 10 asked for that approval and has no answer yet; rule 11 lets the plan go on with the recommended choice, so the edges below are declared in the code and still wait for the answer. Each edge is one line in a Domain class's `requires()`; `tests/Unit/Domains/DomainClassesTest.php` lists them all.

## Declared dependencies

| Domain | Requires | Why | Status |
|---|---|---|---|
| Plans | Tasks | a plan's phases hold tasks | approved (plan 1) |
| Hooks | Agents | the scoped agent context, the launch transaction and the launch events | declared under rule 11, awaiting question 10 |
| Hooks | Links | its two models use the Linkable trait (rule 3) | declared under rule 11, awaiting question 10 |
| Agents | Links | its three models use the Linkable trait | declared under rule 11, awaiting question 10 |
| Tasks | Hooks | the WorkingOnTask state and its push from a listener | declared under rule 11, awaiting question 10 |
| Tasks | Links | the Task model is Linkable | declared under rule 11, awaiting question 10 |
| Chat | Hooks | the AnsweringMessage state and its push | declared under rule 11, awaiting question 10 |
| Chat | Links | the Message model is Linkable | declared under rule 11, awaiting question 10 |
| Sequences | Hooks | the FollowingSequence state and its push | declared under rule 11, awaiting question 10 |
| Sequences | Links | the SequenceRun model is Linkable | declared under rule 11, awaiting question 10 |
| Processes | Hooks | the shell parser it supplies for the hook inputs | declared under rule 11, awaiting question 10 |
| Memory | Hooks | its reaction and reminders after a compaction | declared under rule 11, awaiting question 10 |
| Memory | Links | the Memory model is Linkable | declared under rule 11, awaiting question 10 |
| Rules | Hooks | its reminders after a compaction | declared under rule 11, awaiting question 10 |
| Rules | Links | the Rule model is Linkable | declared under rule 11, awaiting question 10 |

Left out on purpose: Reminders requiring Hooks, Agents requiring Profiles, and any edge from Hooks back to a domain that contributes a state. Hooks never names a task, message or sequence; Agents never names Hooks, which fills the Agents-owned `LaunchTransaction` contract instead.

If you decline an edge, the code that needs it moves out: the domain's states, listeners or models leave that domain, and its `requires()` line goes.

## Owner stores the plan had to create

No owner store existed for the subjects the states are about, so plan 2 built the first, minimal one of each in its own domain, holding only what the stack needs. Later plans extend these stores; they do not add second ones.

| Domain | Store | Built in |
|---|---|---|
| Tasks | `tasks`, `Task`: title, state, run number, the agent and session working on it | task 62 |
| Chat | `messages`, `Message`: body, state, the agent and session that owe an answer | task 63 |
| Sequences | `sequence_runs`, `SequenceRun`: steps, current step, state, the agent and session | task 64 |
| Processes | `HookCommandFacts`: the shell parser and the command catalog | task 65 |
| Agents | `agents`, `agent_sessions`, `launch_credentials` and the launch, loss and child operations | tasks 57, 70, 72 |
| Memory | `memories`, `memory_compactions`: weights faded once per compaction | task 71 |
| Rules | `rules`, `Rule`: text and state | task 71 |
| Links | `links`, `Link`, `Linkable` | task 84 |

## Owner work still missing

| Missing | Owner and files | Follow-up |
|---|---|---|
| The host shim that signs calls, posts them and answers with the outage reply when the journal is down | Agents and Hooks host side; the `journal-hook <program>` command the isolated settings name | task 88 |
| Captured fixtures from pinned program versions, the Codex settings shape and child identity | Hooks; `tests/Fixtures/Hooks/ClaudeCode`, `tests/Fixtures/Hooks/Codex`, `docs/hooks/program-capabilities.md` | task 89 |
| Recording the program's session id on every session start | Hooks endpoint with Agents' `LaunchSessions::mapProgramSession` | task 90 |
| Saved command records, so a journal command counts as saved only when it is one | Processes; `app/Domain/Processes/CommandCatalog.php` | task 91 |
| Agent scoping (rule 4) on the new task, message, sequence, memory and rule stores | Tasks, Chat, Sequences, Memory, Rules models | task 92 |
| A full hook call and a lock wait measured on the live Octane app | Hooks; `docs/hooks/program-capabilities.md` | task 93 |
