# agent-journal

<!-- BEGIN: agent-journal, form 2 (auto-generated, run `journal upgrade`) -->

## Where the journal comes first

The journal's lines come first on how you report, how you carry on and what you say in the chat. This file's own safety and deploy rules still stand. The user's own word comes before both.

## The journal's law

These rules ship with the journal and cannot be switched off.

**L1 — Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.**

Use a fast, economical model for mechanical work with a known answer, a capable general model for careful implementation, and the strongest model only when the task turns on difficult judgement. Inheriting the orchestrator's model is not a model choice. If the dispatch API cannot accept a model, that operation is exempt.

**L2 — Every subagent is bound to a concrete job; never dispatch a generic or default agent.**

Use the most specific available agent type whose declared purpose matches the assignment. On providers without agent types, give the dispatch a concrete task name and bounded prompt. If no suitable specialization exists, keep the work in the main agent instead of manufacturing an unscoped helper.

**L3 — Read narrowly: grep for the line, sed a range, head the file; never print a whole file or long output you do not need.**

Everything a tool returns stays in the context for good and is paid for on every turn after it. Search before you read, read the range you need, and cap output with grep, head or tail. Read a whole file only when you need all of it.

**L4 — Related work goes back to the helper or subagent that already worked on it, in its own session; never start a fresh one on work another already knows.**

A helper or subagent that drew a design, wrote the code or ran the research keeps what it learned. When new work changes its work, is related to it or touches the same code, send it there with a message (SendMessage, journal helper say) rather than dispatching a new one that has to rediscover everything; start fresh only when the earlier one is gone or the new work is unrelated. Reuse means its whole session, not its name: a helper whose agent ended is resumed in the session it ran, with its context, never started again under the same name.

**L5 — Every subagent dispatch names the agent, in the naming style of the profile in use. Name it after a distinguished historical figure with a gentle twist on their trade, such as Dr. Einstein for a profiler or Lady Lovelace for a programmer. Every helper and subagent addresses you as Alfred and never the user: their reports are written to you.**

A name is how the user and the chat tell subagents apart and how they are messaged later; an id or a task line is not a name. Start the dispatch's description with the name, a colon, then the task. The profile in use says how its agents are named.

**L6 — A journal line is an instruction, never a message: act on it and write nothing in the chat, unless the user needs to know (a failure, finished work, a decision that waits on them).**

A line that starts with [journal], a reminder, a notice or an old helper report is the journal telling the agent what to do, not the user speaking. Answering it fills the user's chat with noise. Act on it, or note it and carry on; write in the chat only what the user needs to know, such as a failure, a finished piece of work or a decision that waits on them.

**L7 — Write the least code that solves the whole problem: find what already does it and reuse it, and never write the same logic twice.**

Before writing, search the code for what already does the job or most of it, and extend that instead of adding a second way. Every read or write of one kind of thing (a file, a record, a setting, a provider) goes through the one funnel that owns it, which is where caching and checks live. A fix lands where the fault is born, not where it shows. When you finish, say in a line what you skipped or did not check.

## How you work here

You work alone here: all of it is yours to do. Dispatch no helper and no subagent.

## Rules

- Every viewer heading and label says plainly what it is about
- The voice profile shapes only the agent's chat speech, never code or text

<!-- END: agent-journal, form 2 -->

## Dispatching subagents

Every subagent dispatch names its model: the fast model for mechanical known-answer work,
the general model for careful work without invention, the strongest only for judgement.
Unset means the orchestrator's own model, which is the wrong default. The journal carries this as a rule
(`journal rules`); this file carries it so it is read before the first dispatch.

Every dispatch prompt says the subagent never runs tests: it writes the test that proves its change and names it in its report, and the main agent runs it.

## Controllers by reference

A controller is reached by its class — `Todos(record, actor=SYSTEM)`, `Plans(...)` — never by a string key; `CONTROLLERS[event.type]` is for generic dispatch on an event's type only. A base controller comes from `controllers.types`; a controller a feature owns, such as `Tickets` or `Helpers`, comes from that feature until the sweep moves it down, which is when `controllers.types` will hold it too.

## Skills

A skill is read by the agent, so it exists only when it tells the agent what to do: a command to run or a decision to make at a moment it would otherwise get wrong. A feature that runs by itself gets no skill; its help lives on the Settings page, and anything the agent must act on travels in the nudge the feature sends. Before adding a skill, fold it into the skill of the subject it belongs to (memory, reports, to-dos, messages, tickets) rather than starting another.

## Tests

The default commands carry no hand-written tests. Eight generated runs cover them: `tests/test_every_action.py` loops over every registered resource type and every action on its controller, `tests/test_the_gate.py` loops over every provider, `tests/test_the_expectations.py` plays every expectation every registration carries, `tests/test_the_catalogue.py` walks every resource type and every moment it has, `tests/test_the_layers.py` holds declaring and events to naming nothing above themselves (those two packages only, until to-do 4591 widens it), and `test_it_boots.py`, `test_the_flows.py` and `test_the_viewer.py` play the boot, the core flows and the viewer. Between them they cover create, read, update, complete and the rest for every type, and what each registration promises it does.

A feature is allowed one test file, `src/features/<name>/test.py`, beside its `feature.py`, with at most 10 tests (a cap on test methods, not lines) — the `check` rows scripts/checks/test_shape.py and scripts/checks/one_client.py hold both, with scripts/checks/funnels.py for bodies written twice (`journal check sweep`). It exists only when the feature does something the generated runs cannot see: a hold on writes, a nudge, a file on disk, a process. A feature that only adds commands has none.

<!-- BEGIN: code-commandments briefing (auto-generated, run `composer update`) -->
## Code Commandments — the disciplines in force here

This project's architecture is judged by code-commandments: each discipline is a skill in
`.agents/skills/`, loaded by its exact id, which is always
`commandments-<engine>-<subject>`. HOW you load one is your own business unless your harness
names a way — a tool, a `/`-command, or reading the file. Read the discipline that covers what
you are about to write.

**Load `commandments` for the index** — every discipline, when each one fires, and the rest of
the commands. It is the whole canon, loadable, so it is not copied here. A `judge` finding names
the skill that fixes it, so you are never guessing which to read.

**⚠️ THE ONE RULE EVERY OTHER DEFERS TO — TRACE TO THE SOURCE.** Every sin has an origin; fix it
THERE, never where it surfaces. A finding is a symptom, so before you change a line, walk back to
where the bad value, missing type or wrong shape is BORN. Do NOT silence it: a `?? default`, a
cast, a null-check, a wrapper, a try/catch, or dropping a type to satisfy a detector launders the
problem and grows the code. If the honest fix touches many call sites, touch them — that breadth
IS the bug surfacing. Load `commandments-backend-fix-at-the-source` before your first edit, and
again rather than working from memory, since a compaction drops it silently.

**Finding and fixing sins.** Run `.journal/plugins/code-commandments/bin/commandments-release judge` ONCE, scoped — `--changes` for your
uncommitted work, `--branch` for what differs from main, or a path to judge that tree. A full scan is
slow, so it writes a checklist (the run prints the path) and THAT file, not repeated scans, is how
you work: top to bottom, one line at a time — read that section's skill, fix the sin at its
source, delete the line. Re-run only when the file is empty, and keep going until a run is clean.

**Don't recognise a rule?** `.journal/plugins/code-commandments/bin/commandments-release info <sin>` prints what it flags, why, how it is fixed and
a worked example — the detector name off the checklist works. Guessing at a rule you have not read
is how a finding gets "fixed" by silencing it.

**Leave it cleaner than you found it.** A finding on code you touch, or read past while working, is
yours to resolve at its source.
<!-- END: code-commandments briefing -->
