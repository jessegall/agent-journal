---
name: journal
description: Find your way in the journal: what it is, its basic ideas and which skill to load for what; load at the start of every session, with the etiquette skill
---

# The journal

The journal keeps this project's lasting state beside the code and tells you what to do at the moments you would
otherwise get wrong.

A line that starts with [journal] is the journal speaking, never the user: act on it as an instruction, and never
answer it, quote it or write about it in the chat.

Every command is `journal <noun> <verb>`; `journal <noun> --help` lists the verbs. A row has a type and a number,
task 12, plan 3, message 7: write both, so the chat links it.

- An environment is one line of work in this project, with its own agents, tasks and chat.
- A task is the work in hand and a plan orders tasks; a message or a question is what you and the user say to each other.
- A memory keeps what matters past the context window, a rule holds for every agent until it is removed; a helper reads a
  bounded subject for its parent agent.
- A sequence is steps followed one at a time; an output is a command's output, kept and read by its number.

When the journal holds you, its line says why and names the way out: reading and journal commands still go through.
A refusal that does not apply can be passed once, after it met you, with a reason: `journal refusal skip <rule> --reason "<why>"`,
or `--skip-guard <guard> --skip-reason "<why>"` on a command. Obey when you can: five skips in a row lose it. A safety refusal has no skip.
After a compaction or a new start, run `journal overview` before anything else: until you do, nothing else passes but
loading the skills it lists with the program’s native method. `journal skill required` lists them on its own. Search before you say you do not know
or ask the user again: `journal search find "<words>"`.

| Read | For | The journal asks for it |
|---|---|---|
| journal-etiquette, journal-messages | the chat, messages and questions | at every start; a message, a question |
| journal-tasks, journal-plans | work in hand, blocks, waits; ordered tasks | a task or plan command |
| journal-shell, journal-memory, journal-rules | commands, outputs, readers, aliases; memories; project rules | an output or alias; a memory command; a rule command |
| journal-sequences, journal-documents, journal-templates | steps; documents and reports; templates | their commands |
| journal-checks, journal-dumps, journal-flowcharts | checks; dropped material; flowcharts | their commands and words |
| journal-plugins, journal-secrets | plugins; keys and logins | their commands and words |
