# The journal: every command, and why it is shaped this way

Read this when you need an option or a verb SKILL.md did not spell out, when you are on
the wrong track, when something seems broken, or when a rule of the journal seems
arbitrary and you want the reason.

Contents: [Commands](#commands) · [Tracks](#tracks) · [Shared, and not shared](#shared-and-not-shared)
· [Subagents](#subagents) · [When something seems broken](#when-something-seems-broken)
· [Why it works this way](#why-it-works-this-way)

## Commands

All of them run as `.journal/journal.py <command>`; `journal` is an alias. `journal help
<verb>` prints one verb's lines.

**Where things stand**

    journal                          track, rules, pins, open work, to-dos, context, hooks
    journal verify                   is the journal wired, and has it fired — in this session?
    journal settings                 every setting, its value, and where it came from

**Reading the transcript**

    journal conversation             what was said since the last compaction
    journal conversation --back=N    N compactions back; --back=1 is what the last summary REPLACED
    journal user                     only the user's own words, in full, never trimmed
    journal search <term> [--all] [--page=N]   every line mentioning it on this track, in every session; 25 a page, newest first; --all is every track
    journal carry [--fresh]          exactly what a session start hands back; nothing is written

**Work**

    journal work start "<what>"           declare it — a commitment, which is why it costs a command
    journal work update "<what moved>" [--on="<work>"]   progress, filed against the open work
    journal work end "<the same words>"   close it; the to-do of the same title closes with it
    journal open                     work declared and never closed, with its notes

`update` refuses when nothing is open and refuses to guess between several; name one with
`--on`. `work end` matches the subject you opened with, case-insensitively.

**Pins, for this track**

    journal remember "<claim>" [--supersedes=N]   a fact that must survive a compaction
    journal pins [--all]             every pin, numbered; --all includes struck ones
    journal pins N --full            the conversation around where pin N was written
    journal strike N "<why>"         retire a pin that stopped being true, no replacement needed
    journal nothing "<why>"          after a context warning: nothing here needs pinning, and why
    journal promote N                lift pin N into a rule; the pin is struck and says where it went

**Rules, for every track**

    journal rule "<ruling>"          a pin that every track obeys
    journal rules [--all]            every rule, numbered
    journal rules N --full           the conversation around one
    journal rule --strike N "<why>"  repeal one, on the record

**To-dos, for this track**

    journal todo "<title>" [--brief] add one; --brief reads a longer brief from stdin
    journal todo [--all]             the titles, numbered; --all includes done ones
    journal todo N                   the whole brief
    journal todo start N             open work with that title; `work end` closes both
    journal todo done N "<how>"      resolved without starting it
    journal todo drop N "<why>"      abandoned, on the record
    journal todo ask N "<question>"  it waits on the user's answer; auto moves on to the next
    journal todo answer N "<answer>" the user answers from the terminal; the agent is told at its next stop and picks it up first
    journal todo auto [on|off]       per track: work through the list without asking, or wait for the user's word

A brief on stdin:

    .journal/journal.py todo "convert the last three widgets" --brief <<'EOF'
    After the merge. Dropdown, Trail and EditorPanel still read props; the user wants
    them state-only like the others. Start from src/View/Widgets/Dropdown.php.
    EOF

**Docs, for every track**

    journal docs                     the catalogue
    journal docs N | N.P             read a doc, or one part
    journal docs add "<title>" --abstract="<one line>" --brief   a new doc; the intro on stdin
    journal docs part N "<title>" --brief   a new part of doc N, from stdin
    journal docs replace N.P --brief a new body; the old one is kept under struck/
    journal docs strike N.P "<why>"  drop a part, on the record
    journal docs final N | draft N   status
    journal docs abstract N "<one line>"   the line every session is handed
    journal docs supersede N by M    point readers of N at M
    journal docs index               catalogue the files .journal/docs/ already holds
    journal docs search <term> [--page=N]   every line of every doc, 25 a page
    --doc=N | --doc=N.P              on remember, rule and todo: cite a doc from the entry

**Tools, for every track**

    journal tools                    the catalogue
    journal tools <name>             read one
    journal tools run <name> [args]  run its entry point from the project root
    journal tools add <name> "<title>" --summary="…" --usage="…" --when="…" --entry=<file> [--brief]
    journal tools set <name> summary|usage|when|entry "<value>"
    journal tools remove <name> "<why>"   retire it under struck/
    journal tools index              catalogue folders under .journal/tools/ that lack a tool.md

**Tracks**

    journal tracks                   every track, current one marked
    journal switch "<name>"          park this one, pick up that one; creates it if new
    journal switch --back            the one you came from

**Chains.** A journal command in a chain exempts only itself from the write gate. A line
whose first non-trivial piece is `journal work start` may write after it; a line that decides
first (`remember`, `rule`, `nothing`) passes the context gate for what follows. `cd` and
`export` before either do not count against it.

## Tracks

A track is a line of work, not a session. Pins, open work and to-dos belong to the track
that made them; rules belong to every track. Switch when the user says a new piece of work
should not inherit the current track's pins and to-dos. Switching parks a track exactly as
it stood and nothing is ever deleted by it. Tracks are shared, so a switch moves every
session in the project.

A track has a transcript: everything said while it was current, across every session.
The record keeps which sessions carried each track, written at every session start and
every switch, so `search` opens only those transcripts and keeps only the stretches the
marks say were on the track. A session older than the index is read the long way once.

## Shared, and not shared

The record — rules, pins, work, to-dos, tracks — is the project's. Every session and every
agent reads and writes the same one, committed with the code. A session that starts
tomorrow is handed the standing rules, the track's pins, its open work and its to-dos.

What is not shared is the hook's bookkeeping: where it last held you, which context rung
it announced, whether a pin is due, the largest tool result. Those are facts about one
transcript and live in `runtime/<transcript>.json`, gitignored. A fresh session starts with
clean marks and a full store.

The CLI reads **this session's** transcript, found through `CLAUDE_CODE_SESSION_ID`, which
every Bash call from inside a session carries.

## Subagents

Subagents do not write the journal. Their `work start`, `remember`, `todo`, `switch` and the
rest are denied with a line saying to report back; `search`, `pins`, `open` and other reads
are fine. Their tool calls are neither gated nor nudged. They are handed the rules on their
first tool call and again at 25%, 50% and 75% of their own window, because a rule binds
their work as much as the main agent's. If you are a subagent, report what you found; the
main conversation files it.

## When something seems broken

`journal verify` reports wired and fired as separate facts, and fired as two: in some
transcript on this machine, and in this session. A hook that is registered and silent looks
exactly like one everybody is obeying. It also says when the context window is unset, in
which case the ladder is silent rather than guessing.

## Why it works this way

Three ideas explain nearly every rule. Knowing them means you can predict what a command
will do instead of guessing.

**A tag is free; work costs a command.** A tag rides on a message you were sending anyway,
so nothing has to be remembered and there is no store to keep current. Declaring work is a
commitment, so it costs a verb, and that cost is the thought.

**A tag describes the message it rides on, and nothing else.** That is why none of them can
be wrong. `[!update]` was struck because its correctness depended on something outside its
own message, an open scope. Progress is `journal work update` now, a command, because it is
about the work.

**Refuse rather than guess.** Every command fails loudly rather than file something
plausible in the wrong place, and every gate names its own way out. A note under the wrong
heading reads as true, and nothing about it looks broken afterwards. This is also why
nothing is ever evicted by a counter: a pin leaves the store only when a person strikes it,
with a reason.

The gates exist because nudges were measured and did not land: a session tagged 843
messages faithfully and ran `work start` zero times, and the user had to ask for a pin after a
context warning. A rule becomes a gate only when its nudge has been shown not to work.
