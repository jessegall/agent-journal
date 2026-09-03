# The journal: every command, and why it is shaped this way

Read this when you need an option or a verb SKILL.md did not spell out, when you are on
the wrong environment, when something seems broken, or when a rule of the journal seems
arbitrary and you want the reason.

Contents: [Commands](#commands) · [Environments](#environments) · [Shared, and not shared](#shared-and-not-shared)
· [Subagents](#subagents) · [When something seems broken](#when-something-seems-broken)
· [Why it works this way](#why-it-works-this-way)

## Commands

All of them run as `.journal/journal.py <command>`; `journal` is an alias. `journal help
<verb>` prints one verb's lines.

**Where things stand**

    journal                          environment, rules, pins, open work, to-dos, context, hooks
    journal verify                   is the journal wired, and has it fired — in this session?
    journal settings                 every setting, its value, and where it came from

**Reading the transcript**

    journal conversation             what was said since the last compaction
    journal conversation --back=N    N compactions back; --back=1 is what the last summary REPLACED
    journal user                     only the user's own words, in full, never trimmed
    journal search <term> [--all] [--page=N]   every line mentioning it on this environment, in every session; 25 a page, newest first; --all is every environment
    journal carry [--fresh]          exactly what a session start hands back; nothing is written

**Work**

    journal work start "<what>"           declare it — a commitment, which is why it costs a command
    journal work update "<what moved>" [--on="<work>"]   progress, filed against the open work
    journal work end "<the same words>"   close it; the to-do of the same title closes with it
    journal open                     work declared and never closed, with its notes

`update` refuses when nothing is open and refuses to guess between several; name one with
`--on`. `work end` matches the subject you opened with, case-insensitively.

**Pins, for this environment**

    journal pin "<claim>" [--supersedes=N] [--doc=<doc>[.<p>]]   a fact that must survive a compaction; --doc: the doc or part it rests on
    journal pins [--all]             every pin, numbered; --all includes struck ones
    journal pins N --full            the conversation around where pin N was written
    journal strike N "<why>"         retire a pin that stopped being true, no replacement needed
    journal nothing "<why>"          after a context warning: nothing here needs pinning, and why
    journal promote N                lift pin N into a rule; the pin is struck and says where it went

**Rules, for every environment**

    journal rule "<ruling>" [--doc=<doc>[.<p>]]   a pin that every environment obeys
    journal rules [--all]            every rule, numbered
    journal rules N --full           the conversation around one
    journal rule --strike N "<why>"  repeal one, on the record

**To-dos, for this environment**

    journal todo "<title>" [--brief] add one; --brief reads a longer brief from stdin
    journal todo [--all]             the titles, numbered; --all includes done ones
    journal todo N                   the whole brief
    journal todo start N             open work with that title; `work end` closes both
    journal todo done N "<how>"      resolved without starting it
    journal todo drop N "<why>"      abandoned, on the record
    journal todo ask N "<question>"  it waits on the user's answer; auto moves on to the next
    journal todo answer N "<answer>" the user answers from the terminal; the agent is told at its next stop and picks it up first
    journal todo auto [on|off]       per environment: work through the list without asking, or wait for the user's word

A brief on stdin:

    .journal/journal.py todo "convert the last three widgets" --brief <<'EOF'
    After the merge. Dropdown, Trail and EditorPanel still read props; the user wants
    them state-only like the others. Start from src/View/Widgets/Dropdown.php.
    EOF

**Docs, for every environment** — `<doc>` is a doc's number or its name (the title, or a unique part of it)

    journal docs                     the catalogue
    journal docs <doc>               read a doc; `<doc>.<p>` reads one part
    journal docs files <doc>         its attachments, as a tree; `docs files` lists every doc's; `docs <doc> files` still works
    journal docs add "<title>" --abstract="<one line>" --brief   a new doc; the intro on stdin
    journal docs part <doc> "<title>" --brief   a new part, from stdin
    journal docs attach <doc> <path> "<what it is>" [--replace]   copy a file or a folder into the doc
    journal docs detach <doc> <name> "<why>"   drop an attachment; kept under struck/
    journal docs replace <doc>.<p> --brief   a new body; the old one is kept under struck/
    journal docs strike <doc>.<p> "<why>"    drop a part, on the record
    journal docs final <doc> | draft <doc>   status
    journal docs abstract <doc> "<one line>"   the line every session is handed
    journal docs supersede <doc> by <doc>    point readers of the first at the second
    journal docs index               catalogue the files .journal/docs/ already holds
    journal docs search <term> [--page=N]   every line of every doc, and every attachment by name, 25 a page
    --doc=<doc> | --doc=<doc>.<p>    on pin, rule and todo: cite a doc, or one part, from the entry

**Tools, for every environment**

    journal tools                    the catalogue
    journal tools <name>             read one
    journal tools run <name> [args]  run its entry point from the project root
    journal tools add <name> "<title>" --summary="…" --usage="…" --when="…" --entry=<file> [--brief]
    journal tools set <name> summary|usage|when|entry "<value>"
    journal tools remove <name> "<why>"   retire it under struck/
    journal tools index              catalogue folders under .journal/tools/ that lack a tool.md

**Environments**

    journal environments                   every environment, this session's marked, the start environment marked, who is on which
    journal switch "<name>"          this session onto that environment; creates it if new
    journal switch "<name>" --project   this session, and where new sessions start
    journal switch "<name>" --session=<id> | --all-sessions   move other sessions (a terminal's switch offers these)
    journal switch --back            the environment this session came from
    journal environments "<name>"    the pickup page: docs to read first, what stands, open work, to-dos, how to begin
    journal prepare "<name>"         create an environment for a piece of work and switch to it (see prepare.md)
    journal delegate "<name>" | --off   this session and its subagents act on it; a subagent's journal lands there
    journal handoff "<name>" "<source>"   an environment made ready BY AGENTS: creates and delegates it, prints the hand-off agent's prompt
    journal handoff "<name>" --run   when it reports READY: the runner's prompt; --off when the run is over
                                     what a hand-off means: .journal/handoff.md (copy of the shipped handoff.default.md)
    journal --env=<name> <command>   any command on a named environment, without switching
    journal loop set                 this session has a loop the hook cannot see; `journal loop` says what is known

**Chains.** A journal command in a chain exempts only itself from the write gate. A line
whose first non-trivial piece is `journal work start` may write after it; a line that decides
first (`remember`, `rule`, `nothing`) passes the context gate for what follows. `cd` and
`export` before either do not count against it.

## Environments

An environment is a line of work, not a session. Pins, open work and to-dos belong to the environment
that made them; rules belong to every environment. Switch when the user says a new piece of work
should not inherit the current environment's pins and to-dos. Nothing is ever deleted by a
switch: every environment's pins and work stay under its name.

Every session is bound to an environment: the project's start environment when it starts, whatever it
switched to since. `journal switch` from inside a session moves that session only, so a
second session on another environment keeps its own pins, work and to-dos. `--project` also
moves where new sessions start; do that when the user says the whole project is moving on.
A switch the user runs from a terminal is always the project's, and it lists the sessions
bound elsewhere with how to move one — the user decides, not the hook. `journal environments`
shows every binding and whether each session is running.

One running session works an environment. Two agents on one environment would share its open work and
its to-do list, and two auto sessions would pick the same chore. So a session that starts
on a taken environment — usually the project's start environment, because the user opened a second
terminal — is told at its start who holds it, held at every stop and refused edits until
it has switched: ask the user which environment this session works on, then `switch "<name>"`.
A switch onto a taken environment is refused. A session is running until its SessionEnd, or
until `session_stale_hours` (24) pass without a hook event from it.

An environment has a transcript: everything said while it was current, across every session.
The record keeps which sessions carried each environment, written at every session start and
every switch, so `search` opens only those transcripts and keeps only the stretches the
marks say were on the environment. A session older than the index is read the long way once.

## Shared, and not shared

The record — rules, pins, work, to-dos, environments — is the project's. Every session and every
agent reads and writes the same one, committed with the code. A session that starts
tomorrow is handed the standing rules, the environment's pins, its open work and its to-dos.

What is not shared is the hook's bookkeeping: where it last held you, which context rung
it announced, whether a pin is due, the largest tool result. Those are facts about one
transcript and live in `runtime/<transcript>.json`, gitignored. A fresh session starts with
clean marks and a full store.

The CLI reads **this session's** transcript, found through `CLAUDE_CODE_SESSION_ID`, which
every Bash call from inside a session carries.

## Worktrees

A linked git worktree shares the main checkout's journal: its `.journal/` is a symlink,
made at session start when the checked-out copy is clean. `journal worktree` says which
case you are in; `journal worktree link` replaces a copy by hand. Never write to a copy.

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

**Every command takes its arguments the same way: `journal <noun> <verb> [<id>]
[<payload>]`, noun first, plural nouns canonical.** `pins`, `rules`, `docs`, `tools` and
`todo`/`todos` all read `<noun>` alone, read one with `<noun> <id>`, and act with an
explicit verb — `add`, `strike`, `list`, `show`, and each noun's own lifecycle verbs
(`start`/`done`/`ask`/`answer` for a to-do, `part`/`attach`/`final` for a doc). `strike`
is the one verb for retiring anything, everywhere — a struck pin, a repealed rule, a
dropped to-do, a removed tool are the same idea and now the same word. Every spelling
that predates this — `pin`, `remember`, `rule`, bare `strike`, bare `promote`, `todo
drop`, `tools remove` — still runs, forever, calling the exact same function its new
alias calls; none of them is printed as deprecated.

**Four kinds of command stay outside that pattern, on purpose, not by oversight.**
`switch`, `prepare`, `delegate` and `handoff` stay top-level verbs rather than being
wrapped under an `environments` noun: they are session/environment *lifecycle* actions,
not collection CRUD — there is no list of them to add to or strike from — and they are
burned into `hook.py`'s hold text, `handoff.default.md`, and every already-generated
`.journal/handoff.md`. Wrapping them would cost every reader a word and buy nothing.
`search` stays top-level for the same reason: it has no collection noun of its own. And
the singleton reads — `conversation`, `user`, `open`, `carry`, `next`, `verify`,
`settings`, `version`, `worktree`, `loop`, `nothing` — are one-shot, not a collection, so
noun-first has nothing to attach to. Separately, `docs detach` keeps its own name rather
than folding into `docs strike`: an attachment is not a part, and `docs strike <doc>
<name>` would be ambiguous against `docs strike <doc>.<p>`.
