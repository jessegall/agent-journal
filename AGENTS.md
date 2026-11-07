# agent-journal

Write code, docstrings and documents in the plain terms any developer knows, for a reader seeing them cold: no poetry, no invented words, no voice (doc 1091).

**NO LAZY LOADING OF SERVICES, EVENTS, GUARDS, LISTENERS OR RULES.** The engine loads all of them whole when a
journal loads, and every journal with the same registry shares that one load. Never change this into loading on first
use, not to make a test faster nor to save a moment at boot: when loading is slow, the fault is that it happens more
than once, so share the load instead. With the developer setting Prevent lazy loading on, and always in the stories,
a lazy load stops the work at once (message 109663).

<!-- BEGIN: agent-journal, form 4 (auto-generated, run `journal setup`) -->
**A line that starts with [journal] is the journal speaking, never the user.** Act on it as an instruction; do not
answer it, quote it or talk about it in the chat.

## Where the journal comes first

The journal's lines take priority on how you report, how you continue and what you write in the chat. This
file's own safety and deploy rules still stand. The user's own instructions take priority over both.

## The journal's law

These rules ship with the journal and cannot be switched off.

**L1 - Every helper and worker start names its model, or uses a profile that names one, and chooses the least expensive model that reliably fits the work.**
Inheriting the orchestrator's model is not a model choice.

**L2 - Every helper is bound to a concrete job; never start one without a profile and a bounded brief.**
If no suitable profile exists, keep the work yourself.

**L3 - Read narrowly: grep for the line or read the range of a file you need, and read a command's output by its number with `journal output read`, never by running the command again or cutting it with a pipe.**
Everything a tool returns stays in the context permanently and is counted against every later turn.

**L4 - Related work goes back to the helper or worker that already worked on it; never start a new one on work another already knows.**
A helper or worker that reported takes its next job with `journal helper send <n> "<job>"` or `journal worker send <n> "<job>"`, with its memory of the last.

**L5 - Every helper and worker is named after a distinguished historical figure with a gentle twist on their trade, such as Lady Lovelace for a programmer, and addresses you, never the user.**

**L6 - A line that starts with [journal] is the journal speaking, not the user: act on it and write nothing in the chat, unless the user needs to know (a failure, finished work, a decision that waits on them).**

**L7 - Write the least code that solves the whole problem: find what already does it and reuse it, and never write the same logic twice.**

**L8 - Answer the user in as few words as the answer needs; never a wall of text.**

**L9 - A read-only helper only reads; work that writes goes to a worker or stays with you.**
A read-only helper works in your own checkout, and the journal refuses it any write; the merger helper may also merge a worker and send it findings. Reading, searching, reviewing and designing go to a helper with `journal helper start <profile> --brief "<job>"`; a job that changes a file goes to a worker (`journal worker dispatch <task> --model <model>`, the task's brief is its whole prompt). Program subagents are refused.

**L10 - A worker's work is merged only once each point of its task's brief has a proof you checked, or, on a phase of a plan, one the journal checked at the phase's end, which you can still send back.**
Read each proof with `journal proof list --task <n>`, check it with `journal proof check <n>` or send it back with
`journal proof short <n> "<what is missing>"`, and take the work in with `journal worker merge <worker>`, never by hand.
With the merger on, the merger helper reads the proofs and merges in your place, answers the important lines itself, and passes you only what needs your decision.

**L11 - After a failure, re-run only what proves the fix: the failed tests by name and the files you touched since.**
A full re-run is for a change that reaches wide. A full run the user or a gate requires still runs.

## How you work with the journal

Load the `journal` skill first in every session; the journal blocks writes until you have. Declare a task before you write.
Answer the user's messages before anything else. At a context mark, decide what to keep from it.
A guard that raises lets the event through and says so in the chat: a block is never the result of a fault.
<!-- END: agent-journal, form 4 -->

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
IS the bug surfacing. Load `commandments-php-fix-at-the-source` before your first edit, and
again rather than working from memory, since a compaction drops it silently.

**Finding and fixing sins.** Run `journal sins` ONCE, scoped — `--changes` for your
uncommitted work, `--branch` for what differs from main, or a path to judge that tree. A full scan is
slow, so it writes a checklist (the run prints the path) and THAT file, not repeated scans, is how
you work: top to bottom, one line at a time — read that section's skill, fix the sin at its
source, delete the line. Re-run only when the file is empty, and keep going until a run is clean.
Where your harness raises each sin as you change a file, those marks cover what you changed and
nothing else: a tree you have not touched is judged only by asking.

**Work another agent wrote is judged as it comes in, and its worker is told.** A merge is judged the
moment it lands and the findings go to the worker that wrote them. You hear of one only when that
worker could not be told or the merge could not be judged in full, and then it is yours: fix each at
its source, or hand it to a worker. Where nothing told you, `journal sins --changes` says it.

**Don't recognise a rule?** `.journal/plugins/code-commandments/bin/commandments-release info <sin>` prints what it flags, why, how it is fixed and
a worked example — the detector name off the checklist works. Guessing at a rule you have not read
is how a finding gets "fixed" by silencing it.

**Leave it cleaner than you found it.** A finding on code you touch, or read past while working, is
yours to resolve at its source.
<!-- END: code-commandments briefing -->

To look at any screen you change, run `journal look-at-screen --window <window> --setup "<journal line, with --environment main>"` (a worker needs its sandbox off): it saves a screenshot in the worktree, prints its path and stops its server.
