# Commands and reference

Everything the journal can do, for when you want the detail. The short version is in the
[README](README.md), and the CLI prints all of this itself: `journal help`, or `journal help
<verb>` for one command.

## Commands

You and the agent use the same commands: the agent from its shell while it works, you
from your terminal. Commands that only make sense for the agent are marked (agent).

### Status

    journal                              environment, rules, pins, work, to-dos, docs, context
    journal open                         the open work, with its notes
    journal environments                       every environment, the current one marked
    journal verify                       wired, and fired in this session?
    journal help <verb>                  what one command does

### Work

    journal work start "<the work>"      declare it; edits are refused until then (agent)
    journal work update "<what moved>"   add a note to the open work (agent)
    journal work end "<the same words>"  close it (agent)
    journal work end "<the same words>" --todo   and close the to-do of that title; without
                                         it the row stays open — closing a to-do is always
                                         explicit, never a side effect of ending work
    journal work await "<what you wait on>" [--agent=<id>|--pid=<n>] [--for=<minutes>]
                                         the work is in flight on something that cannot be
                                         hurried; the nudging stops until it lands (agent)
    journal work park "<what you need>"  it cannot go on without you, and says so (agent)

### To-dos

    journal todos                        the list, HIGHEST PRIORITY FIRST (--order-by-id for plain number order)
    journal todos show <n>               one, with its brief (also: `journal todo <n>`)
    journal todos add "<title>" --brief  park work for later; brief from stdin (also: `journal todo "<title>"`)
    journal todos priority <n> <value>   bigger is more important; a number or a name (low/default/high/critical); 100 unless set
    journal todos start <n>              pick it up as the open work (agent)
    journal todos done <n> "<how>"       close it without starting it
    journal todos strike <n> "<why>"     abandon it, on the record (also: `todo drop`)
    journal todos ask <n> "<question>"   files a question linked to the to-do; the list moves on (agent)
    journal todos answer <n> "<answer>"  answer its open question; the agent is told at its next stop
    journal auto-mode enable|disable     enabled: the agent works through the list itself
    journal todos prune --older-than=<age>|--before=<date> [--force]   done/dropped to-dos older than that — ARCHIVED under todo/<env>/archived/, or actually deleted with --force; an open to-do is never touched

### Pins and rules

    journal pins                         the pins on this environment
    journal pins add "<claim>"      pin a fact; --doc=<doc> or --doc=<doc>.<p> cites a doc or one part (also: `journal pin "<claim>"`)
    journal pins <n> --full              the conversation around where a pin was written
    journal pins strike <n> "<why>"      retire a pin that stopped being true (also: bare `strike <n> "<why>"`)
    journal pins promote <n>             lift a pin into a rule (also: bare `promote <n>`)
    journal rules                        the rules
    journal rules add "<ruling>"         a rule for every environment (also: `journal rule "<ruling>"`)
    journal rules strike <n> "<why>"     retire a rule (also: `journal rule --strike <n> "<why>"`)
    journal nothing "<why>"              after a context warning: nothing to pin (agent)

### Reminders

    journal reminders                    what is being repeated at every stop
    journal reminders add "<instruction>"   repeat it; --until="<condition>" the agent judges itself
    journal reminders done <n> "<why>"   stop repeating it
    journal reminders move <n> <env>     move one to another environment

### Questions

`<ref>` names a resource: `todo 22`, `doc 4.1`, `pin 3`, `rule 2`.

    journal questions                    open questions first, then answered (also: `journal question`)
    journal questions add "<question>" [--about=<ref>]...   a question on this environment, about any number of resources
    journal questions show <n>           the question, what it is about, and the answer
    journal questions answer <n> "<answer>"   answer it; the agent is told at its next stop
    journal questions link <n> <ref>     link it to one more resource (`unlink` removes one)
    journal questions withdraw <n> "<why>"   it no longer needs an answer

### Docs

`<doc>` is a doc's number or its name.

    journal docs                         the catalogue
    journal docs show <doc>                   read a doc; <doc>.<p> reads one part
    journal docs files <doc>             its attachments, as a tree; `docs files` lists every doc's (also: `docs <doc> files`)
    journal docs [--all]                 the catalogue; --all is every environment's, not just this one
    journal docs add "<title>" --abstract="<one line>" [--global] --brief
    journal docs move <n> "<environment>" | --global    change a doc's scope after the fact
                                         a new doc; the intro from stdin
    journal docs part <doc> "<title>" --brief
                                         add a part: a section, a report
    journal docs attach <doc> <path> "<what it is>"
                                         copy a file or a folder into the doc
    journal docs detach <doc> <name> "<why>"   drop an attachment; kept under struck/
    journal docs strike <doc>.<p> "<why>"   drop a part; kept under struck/
    journal docs final <doc>             mark it settled
    journal docs supersede <doc> by <doc>   point readers of an old doc at the new one
    journal docs index                   catalogue what is already in .journal/docs/
    journal docs search <term>           search every line of every doc, and attachments by name
    journal docs paths <doc>             the full path of every attachment, to open or pass on
    journal docs draft <doc> | journal docs archive <doc> "<why>"
    journal docs title <doc> "<title>" | journal docs abstract <doc> "<one line>"
    journal docs replace <doc>.<p> --brief   swap a part; the old text goes to struck/

### Tools

    journal tools                        every tool: what it does, how to call it
    journal tools show <name>                 read one
    journal tools run <name> …           run it from the project root
    journal tools add <name> "<title>" --summary="…" --usage="…" --entry=<file>
                                         catalogue a script (agent)
    journal tools index                  catalogue folders already under .journal/tools/

### Plans

A plan is what will be done and in what order: phases, each with to-dos and a condition for
being complete. You approve it before the agent starts, and again at a checkpoint.

    journal plans                        every plan on this environment
    journal plans show <n>               one plan: its phases, their to-dos, where it stands
    journal plans add "<title>" --goal="<what done looks like>" --brief
                                         draft one; the approach from stdin (agent)
    journal plans phase <n> "<title>" [--when="<complete when>"] [--checkpoint] [--before=<p>]
                                         add a phase, or insert one before phase <p> — the phases
                                         after it move along with their to-dos and checkpoints
    journal plans rephrase <n> <p> ["<title>"] [--when=] [--checkpoint]
                                         correct a phase that was written wrong
    journal plans todos <n> <p> <to-dos> put to-dos in a phase, e.g. 12,14,15
    journal plans edit <n> …             correct a plan's title, goal or approach (agent)
    journal plans ready <n>              the agent saying a draft is ready for you (agent)
    journal plans activate <n>           approve it; the agent starts phase 1
    journal plans continue <n>           past a checkpoint
    journal plans park <n> "<why>" | journal plans abandon <n> "<why>"

### Messages, questions, suggestions, comments and reports

Five ways you and the agent talk when you are not both at the terminal. All of them reach an
idle agent through the launcher (`journal claude`, `journal codex`), and are told at its next stop otherwise.

    journal messages "<message>"         leave one for the agent: an instruction, a follow-up
    journal messages                     what is waiting, then what has been handled
    journal messages show <n>            one, with the parts it was split into and what each became
    journal messages reply <n> "<text>"  the agent's note back to you, under the message (agent)
    journal messages process <n> --part="<words>" --became=<ref>
                                         the agent recording what one part of a message became (agent)
    journal messages file <n> <name> "doc <d>"|keep   file an attachment, or leave it where it is (agent)
    journal messages waiting             only the ones not handled yet
    journal messages archive <n> "<why>" take one out of the conversation
    journal reports                      what the agent was asked to check or research, newest first
    journal reports show <n>             one in full
    journal reports add "<title>" --brief [--about=<ref>]
                                         the agent filing what it was asked to find out (agent)
    journal reports doc <n>              it turned out to be a document; move it (agent)
    journal reports archive <n> ["<why>"] | journal reports keep <n>
    journal suggest "<the change>" --brief   the agent proposing something nobody asked for (agent)
    journal suggestions                  what the agent has proposed
    journal suggestions show <n>         one in full
    journal suggestions accept <n> | adjust <n> "<change>" | decline <n> ["<why>"]
    journal suggestions withdraw <n> "<why>"   the agent taking one back (agent)
    journal comments add "<ref>" "<text>"    say something about a to-do, doc, pin, rule or reminder
    journal comments [<ref>]             what has been said, everywhere or about one thing
    journal comments show <n> | journal comments done <n>   read one; mark one handled
    journal notifications [--all]        what the journal has told you it did; --all adds read ones
    journal notify "<what finished>" [--about=<ref>]   the agent telling you something (agent)
    journal notifications read <n>       mark one read

### Connections

Services the project can reach. A connection keeps the NAME of the environment variable
holding its token, never the token — the journal is read back verbatim into every session,
so a secret written here is a secret that has leaked. A value with the shape of a token is
refused where it is typed.

    journal connections                  what this project can reach, and whether each token is set here
    journal connections show <name>      one, and what this environment changed about it
    journal connections add <name> "<what it is for>" [--kind=] [--url=] [--secret=<ENV_VAR>]
    journal connections set <name> purpose|kind|url|secret "<value>"    for the project
    journal connections here <name> purpose|kind|url|secret "<value>"   on this environment only; --off puts it back
    journal connections remove <name> "<why>"

### Coding style

Rules about how this project's code is written, one skill per subject, loaded before the
agent writes code the rule covers.

    journal style                        every style rule this project has decided
    journal style show <subject>         one, with its reasoning and examples
    journal style sync                   write the rules into CLAUDE.md and the skills

### Reading back

    journal conversation                 what was said since the last compaction
    journal conversation --back=1        the stretch the last summary replaced
    journal user                         the user's own words, in full
    journal carry                        everything a new session is handed, in one read
    journal search <term>                every mention on this environment, every session

### Environments and maintenance

    journal environments                       every environment, this session's marked, and who is on which
    journal env | envs | environment | tracks  the same noun; every spelling is permanent
    journal switch "<name>"              this session onto that environment; from a terminal, the project
    journal switch "<name>" --project    this session, and where new sessions start (agent)
    journal switch "<name>" --session=<id>   move one running session; --all-sessions moves all
    journal switch --back                the environment this session came from
    journal claim "<name>" "<why>"       take one a live session still holds: it is unbound and told at its next stop why, by whom, and how to take it back
    journal environments switch|claim|prepare|grant …   the noun+verb twin of each; both spellings call the same function
    journal environments "<name>"        the pickup page of one environment
    journal prepare "<name>"             create an environment for a piece of work and switch to it (agent)
    journal grant "<name>"               lend it to this session's subagents; this session does not move (agent)
    journal grant                        what this session has lent; --off "<name>" takes it back (agent)
    journal environments remove "<name>"        what it holds, and what removing it destroys
    journal environments remove "<name>" --yes  DELETE it: its pins, its work and its to-dos go, and the
                                                record keeps one line saying it existed and what it held.
                                                Never the start environment, never one a live session is
                                                on; its docs become the project's rather than going with it
    journal assign <n> --to="<agent>"    hand one to-do to one lent agent; --off gives it back (agent)
    journal todos report <n> "<how>"     a lent agent says a row is finished; the parent closes it (agent)
    journal --env=<name> <command>       any command on a named environment, without switching
    journal loop set                     this session has a loop running the hook cannot see (agent)
    journal enable | journal disable     the kill switch — disable makes every hook inert until enable; the user's call, never the agent's own idea
    journal settings                     every setting and where it came from
    journal serve [--port=<n>] [--open] [--detach]   the web interface over this journal
    journal version                      the installed version; is a newer one out?
    journal update                       pull the latest journal and print what changed
    journal cleanup                      what in the record has evidence against it; `cleanup read` is the half no check can do
    journal migrate                      move a record written by an older version; ordinary commands do it on their way through


## What each of these is

### Work

The agent declares each piece of work in a sentence before it starts, adds notes
as it goes, and closes it when done. What is open is shown to every session, so nothing is
left half-done without a trace.

### To-dos

Work put off for later, one file each with a title and a brief. The agent
parks a to-do when you ask for something while it is busy with something else, and picks
it up when you say so. A to-do can be marked as needing your answer; you answer from the
terminal and the agent is told at its next stop. Each one has a priority — a number,
bigger meaning more important, 100 unless you set it — so the list, `journal next`, and
what auto mode picks up on its own all lead with the thing that matters most, not just
the oldest one waiting.

### Auto mode

Switch it on for a to-do list and the agent works through the list by
itself, one item at a time, making its own decisions. It only stops for things it truly
cannot decide, and it tells you which.

### Pins

Short facts a later session would get wrong without: a ruling you made, a
constraint that was found, a decision and the reason. They are handed to every session.
The reasoning behind a pin stays in the transcript, one command away.

### Rules

Facts that hold everywhere in the project, whatever the agent is working on.
Repeated to the agent as its context fills, and given to every subagent it spawns.

### Docs

Findings longer than a line: a design once it is agreed, a report from a
subagent, an investigation with numbers. They live as markdown in `.journal/docs/`,
one folder per doc with a file per part, and the journal keeps a catalogue so every session
knows what exists. Pins, rules and to-dos can cite a doc.

Docs hold files too: a design's HTML, a screenshot, a PDF, a CSV, a whole folder.
`journal docs attach <doc> <path> "<what it is>"` copies it in and lists it; `journal docs
<doc> files` shows a doc's attachments as a tree. A doc is referenced by number or by name.

### Tools

Scripts the agent writes for jobs that come back: a class mover, a coverage report, a
fixer for one directory. Each lives under `.journal/tools/<name>/` with a `tool.md` that
says what it does and how to call it, and `journal tools run <name>` runs it. Every session
is handed how many there are beside `journal tools`, so the next agent uses the tool instead
of writing it again.

### Environments

Separate lines of work, each with its own pins, reminders and to-dos. Rules are shared
across all of them; a DOC has a scope — it belongs to the environment it was written on,
or to the project with `--global` — and either way stays readable by number from
everywhere, so a citation never goes dark. A session starts on NO environment — there is no default one, and the journal
refuses to read or write one until the session has picked. Once it has, that binding is its
own, so two sessions can work two environments of one project at the same time. A switch from inside a session moves only that
session; a switch from a terminal moves where new sessions start, and says which running
sessions stayed where they were and how to move one along. One running session works a
environment: a second session that lands on a taken environment is told, and switches.

### Preparing work, and lending it to subagents

When you ask for it, the agent prepares an environment for an issue or PR: the source as a
doc with its files attached, a plan and its steps, pins for what must hold, and one to-do
per unit of work. `journal prepare "<name>"` creates it and switches to it;
`journal environments "<name>"` is the page whoever picks it up reads first.

A subagent cannot be detected — its shell carries the dispatching session's id, so nothing
downstream can tell the two apart. What cannot be detected can be lent.
`journal grant "<name>"` lends an environment to this session's subagents without moving
the session itself, and prints the sentence to paste into the dispatch. The subagent
declares the same grant back with `--env="<name>"` on every command, and the hook holds the
two against each other at one door.

A lent agent gets a **sub-environment**: its own work ledger under that environment, and
the environment's pins and reminders read-only. It cannot write a pin, a rule, a doc or a
tool, and it cannot switch environments — it reports upward and the session that dispatched
it decides. `journal assign <n> --to="<agent>"` hands it one to-do; a held row leaves
everyone else's list while that agent is alive, and it may report the row finished but
never close it. Two subagents on one environment keep separate ledgers, so neither can
close the other's work.

    journal grant "<name>"               lend an environment to this session's subagents
    journal lent                         what a dispatched agent runs to learn its own name (agent)
    journal assign <n> --to="<agent>"    hand one row to one subagent
    journal todos report <n> "<how>" --as="<agent>"   a subagent saying a row is finished (agent)

### Reminders

An instruction you want the agent told again — not once at the start, where it is read and
then drifted from. A reminder is repeated at every stop and every 50 tool calls, for as
long as it stands. `journal reminders add "<the instruction>"` writes one, with an optional
`--until="<condition>"` the agent itself judges; `journal reminders done <n> "<why>"`
retires it.

### Tags

Every message the agent writes starts with a tag: a discovery, a correction,
something it is blocked on, information, or a plain reply. That makes the transcript
readable by kind, and lets the journal show you only what mattered.

### Reading back

The conversation since the last compaction, the exact stretch a summary
replaced, your own words in full, and a search across every session of the environment, all
cited by line number.

### Context warnings

At 50, 70, 90 and 95 percent of the context window the agent is
warned, shown what is filling the context, and required to decide what must survive
before it does anything else.


## What the hooks enforce

- **An untagged message** at a stop: held once and told the tags.
- **An edit with nothing declared**: refused, told to `work start`.
- **A context warning** at 50, 70, 90, 95 percent: nothing else runs until the agent has
  pinned something or said, with a reason, that nothing needs pinning.
- **Work deferred in words** after you asked for something: the next tool call is refused
  until it is parked as a to-do.
- **Work still open** at a stop: reminded; in auto mode, at every stop.
- **Auto on and no loop running**: asked to start one before anything else.
- **A second session on an environment another session is working**: told at its start, held at
  its stops and refused edits until it switches. One running session works an environment.
- **A pin over 400 characters, or one naming a temporary path**: refused before it runs.
- **A markdown file written by hand**: a one-time hint that docs are catalogued.
- **Something tool-shaped**: a script written into a scratch or scripts folder, the same
  inline script run twice, a scratch script run by name: a one-time hint to make it a tool.
- **A reference file read twice**: a rendered design, an export, a PDF, a log, anything
  that is not a source file of the project: a one-time hint to attach it to a doc.

At a stop these form a queue: one subject per stop, each once per turn, in priority order,
until nothing is pending. Every hold names its way out. The order is declared in one place in
`hook.py` and the agent's own skill lists it in full; a copy here would be a copy that drifts.

A subagent is never held and never nudged — a hold on an actor with no conversation to
return to is a hold nobody reads. It writes nothing at all unless the session that
dispatched it ran `journal grant`, and then only inside what it was lent: its own work
ledger and the to-dos assigned to it. Rules, docs, tools and environment switches are
refused with the reason, because each of those writes where every session reads.


## Where things live

    .journal/record.json      rules, the environment registry, session bookkeeping — committed
    .journal/environments/<name>/   one folder per environment — committed
        pins.json  work.json  reminders.json  questions.json  todo/<one file per to-do>
        agents/<id>/work.json       a lent subagent's own ledger
    .journal/tools/<name>/    a tool.md and its script — committed
    .journal/docs/            the docs, one folder each — committed
    .journal/settings.json    only what you changed from the defaults
    .journal/runtime/         the hooks' own bookkeeping, per transcript — ignored by git


## Worktrees

A git worktree of the project shares the journal. At session start in a linked worktree,
the checked-out copy of `.journal/` is replaced with a symlink to the main checkout's,
so both read and write one record; a copy with local changes is left alone and the main
journal is used instead, until `journal worktree link` replaces it.

**A worktree is orthogonal to the journal.** It is not an environment, it does not hold
one, and it never decides one. It exists so several agents can work one project at once
without touching each other's files — a fact about the filesystem, not about the record.
Whoever enters a worktree keeps the environment they were on, and an agent dispatched from a
session works that session's environment, with its own ledger under it.

So "an agent with its own journal" and "an agent in a worktree" are two different things,
and they were once conflated: the ledger comes from the GRANT, the files come from the
worktree. A subagent in a worktree of its own needs nothing extra — no session start fires
for a subagent, so the linking happens on its **first tool call**, the same event that tells
it its name, and its ledger, its claim on a to-do and its report all land in the main
checkout's record.


## How does it work?

Claude Code already writes every session to a transcript on disk, by default, with no
setup: every message, every tool call, every hook. The journal builds on that default
instead of inventing a store of its own. It reads the transcript, keeps no copy, and
adds only the small record of what must survive.

- **Tags.** The agent opens each message with a tag such as `[!discovery]`. The tag is in
  the transcript, so the journal can find the messages that carried something without
  anyone filing them, and skip the routine ones.
- **Line numbers.** Every message has a line. Pins record the line they were written at,
  search prints the line of every hit, and a line is something you can go and check.
- **Environments.** A session that has chosen one is bound to it in `.journal/runtime/bindings.map`,
  on this machine only. Session starts and environment switches leave marks in the transcript, so the
  journal knows which lines belong to which environment and can search one environment across every
  session.
- **Compaction.** A summary keeps what was done and drops what was decided; the transcript
  keeps everything. After a compaction the agent gets the record back and is pointed at
  the exact stretch the summary replaced.
- **Hooks.** Eight Claude Code hooks do the enforcing: at session start and end, at each
  prompt, before and after each tool call, at each stop, at a subagent's stop, and before
  a compaction.
- **Files.** Pins, rules, work and environments in `.journal/record.json`, a file per to-do, a
  folder per doc. Committed, so the team and every later session read the same journal.


## Settings

`.journal/settings.json` holds only what you change; everything else is at its default.

**`journal settings` prints every one of them, live, with its current value and where that
value came from.** Read it there rather than here — a list in a file cannot track a setting
that is added, and a setting that is REMOVED goes on being documented long after the CLI has
started rejecting it, which is exactly what happened to this section.

A few worth knowing about:

    context_window       the context window the warnings are measured against;
                         learned automatically at the first compaction, set this to override
    context_warn_ladder  where the warnings fire, default [0.5, 0.7, 0.9, 0.95]
    pin_max_chars        the cap on a pin, default 400
    await_default_minutes  how long `journal work await` holds off the nudge, default 20
    await_max_minutes    the cap on one wait, default 120
    stall_calls          tool calls on one to-do without progress before the agent is nudged, default 40
    attach_hint_reads    reads of a non-source file in one session before the attach hint, default 2
    bind_on_start        bind a new session to the project's start environment, default false;
                         false means it starts on none and chooses from the first prompt
    one_session_per_environment  a second session on a taken environment is told to switch, default true
    reminder_every       tool calls between reminder firings, default 50
    session_stale_hours  hours without a hook event before a session counts as gone, default 24
    stop_priority        the order of the stop queue by subject, e.g. {"work": 1}; lower first
    docs_dir             where docs live, default .journal/docs
    silenced             names of nudges to switch off, e.g. ["tool_cost", "markdown_hint"]
