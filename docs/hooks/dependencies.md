# Hooks: domain dependencies and missing producers

Plan 2 builds the agent stack state machine of doc 3 in the Hooks domain (`app/Domain/Hooks`). Rule 9 says a domain declares a new required domain only after the user approves it, so the edges below are proposals. Until one is approved, the work that needs it is built as an independent contract and left switched off.

## Proposed dependencies (doc 3, section 14.1)

| Domain | Would require | Why | Status |
|---|---|---|---|
| Hooks | Agents | the scoped agent context, the launch and the session identity | declared under rule 11, awaiting question 10 |
| Hooks | Links | its two models use the Linkable trait (rule 3) | declared under rule 11, awaiting question 10 |
| Tasks | Hooks | the WorkingOnTask state and its push from a listener | declared under rule 11, awaiting question 10 |
| Chat | Hooks | the AnsweringMessage state and its push | declared under rule 11, awaiting question 10 |
| Sequences | Hooks | the FollowingSequence state and its push | declared under rule 11, awaiting question 10 |
| Processes | Hooks | the parsed command facts and the saved command refusal | proposed |
| Memory | Hooks | context after a compaction | proposed |
| Rules | Hooks | the rules told at start and after a compaction | proposed |
| Reminders | Hooks | optional, a reminder as context | proposed |

Approved today: Plans requires Tasks (plan 1). Nothing else.

Declared without an answer: rule 11 lets the plan go on with the recommended choice, so Tasks, Chat and Sequences declare Hooks as their first state is written, Hooks declares Links when its two models are written, and Hooks declares Agents and Agents declares Links when the agent context is written. Each is one line in the domain class and is removed if you decline.

## Producers no plan has built yet

- Tasks: a task model and store with open and closed states, for WorkingOnTask.
- Chat: a message model and store with read and unread, for AnsweringMessage.
- Sequences: a sequence run with its current step, for FollowingSequence.
- Processes: the shell parser, the runner and the command facts (doc 5).
- Agents: the agent and session records, the launch with isolated settings (rule 2) and the heartbeat.
- Links: the links table and the Linkable trait (plan 2, task 84).

Each becomes its own owner task in the domain that owns it; plan 2 does not build a second version of any of them.

## The question asked

Question 10 asks you once to approve the concrete edges above (Hooks to Agents and Links; Tasks, Chat, Sequences, Processes, Memory and Rules to Hooks; model-owning domains to Links), leaving out Reminders to Hooks, Agents to Profiles and any edge from Hooks back to a contributor. Recommended: approve them all. Until the answer comes, the plan works on and keeps the parts that need an edge switched off; the question is not an approval.

Answer: not yet given.
