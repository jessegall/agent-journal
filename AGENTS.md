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


To look at any screen you change, run `journal look-at-screen --window <window> --setup "<journal line, with --environment main>"` (a worker needs its sandbox off): it saves a screenshot in the worktree, prints its path and stops its server.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
