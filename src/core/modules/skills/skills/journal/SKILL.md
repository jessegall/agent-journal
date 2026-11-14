---
name: journal
description: Find your way in the journal: what it is, its basic ideas and which skill to load for what; read it before your first command of every session
---

# The journal

The journal keeps this project's lasting state beside the code and tells you what to do at the moments you would
otherwise get wrong.

A line that starts with [journal] is the journal speaking, never the user: act on it as an instruction, and never
answer it, quote it or write about it in the chat.

Every command is `journal <subject> <verb>`; `journal <subject> --help` lists the verbs. A row has a type and a number,
task 12, plan 3, message 7: write both, so the chat links it.

- An environment is one line of work in this project, with its own agents, tasks and chat.
- A task is the work in hand and a plan orders tasks; a message or a question is what you and the user say to each other.
- A memory keeps what matters past the context window, a rule holds for every agent until it is removed; a helper does a
  bounded job for its parent agent: a read-only helper only reads, a worker is a helper that writes.
- A sequence is steps followed one at a time; an output is a command's output, kept and read by its number.

When the journal holds you, its line says why and names the way out: reading and journal commands still go through.
Only a refusal that is wrong for the case in hand is skipped, never to get on faster. `journal refusal skip <rule> --reason "<why>"`
holds a skip; `journal refusal confirm <n> --tried "<what you tried>"` lets it pass the next attempt once (a helper's waits until its main agent runs `journal refusal approve <n>` or `journal refusal decline <n>`), and
`journal refusal withdraw <n>` gives it up. Either answer is final. A `--skip-guard` flag only spends a confirmed skip.
Obey when you can: five skips in a row lose it. A safety refusal has no skip.
After a compaction or a new start, run `journal overview` before anything else: until you do, nothing else passes but
loading the skills it lists with the program’s native method. `journal skill required` lists them on its own. Search before you say you do not know
or ask the user again: `journal search find "<words>"`.

| Read | For | The journal asks for it | Who |
|---|---|---|---|
| journal | what the journal is, its basic ideas and which skill to load for what | at every start | all |
| journal-etiquette, journal-messages | the chat, messages and questions | at every start; a message, a question | all |
| journal-tasks, journal-sequences, journal-documents, journal-checks, journal-library | work in hand, blocks, waits; steps; documents and reports; checks; the team's library | their commands and words | all |
| journal-shell, journal-memory, journal-rules, journal-secrets | commands, outputs, readers, aliases; memories; project rules; keys and logins | an output or alias; a memory or rule command; a key | all |
| journal-dispatching-workers | sending, checking and merging workers | a dispatch; a merge | main agent, merger |
| journal-worker | working as a worker: proofs, commits, the merge ask | a worker's task | worker |
| journal-plans, journal-planning, journal-plan-dispatch, journal-plan-review-applying, journal-templates | ordered tasks; how thorough a plan is; getting a plan made; working a review into a plan; templates | a plan command; a review | main agent |
| journal-helpers, journal-merger, journal-work-modes | read-only helpers; merging a worker's work; auto mode, presets and the worker limit | a helper command; a merge; a work control | main agent |
| journal-dumps, journal-flowcharts, journal-plugins, journal-transcriptions | dropped material; flowcharts; plugins; transcripts | their commands and words | main agent |
| journal-functional-design, journal-user-stories | writing a functional design; writing user stories | a design or a story book to write | worker |
| journal-test-draining | draining the failed tests of a full run | a full run with failures | all |
| journal-graphify | finding code through the knowledge graph | a code search while Graphify is on | all |
