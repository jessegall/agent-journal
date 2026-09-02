# agent-journal

A journal for AI coding agents working in your project, built for Claude Code.

## What is it?

When you work with a coding agent for hours or days, things get lost. The agent's context
fills up and gets compacted into a summary. Sessions end. New sessions start with nothing.
Decisions you made together, work that was put off, findings from investigations, the
reasons behind a design: all of it lives only in the conversation, and the conversation
is what gets thrown away.

agent-journal is the fix. It gives the agent a journal inside your repository: what it is
working on, what it will do later, what was decided, what it found. Every new session gets
that journal back. Every compaction is survived. And because the journal is plain files in
your repo, you can read it, edit it and share it with your team.

## What does it do?

- **Keeps the agent's work organised.** The agent declares what it is working on before it
  edits anything. Work it cannot do now is parked as a to-do with a brief. Facts that must
  not be lost are pinned. Rules that hold everywhere are recorded. Designs and reports are
  filed as docs.
- **Hands it all back to every session.** A new session, or the agent right after a
  compaction, starts with the rules, the pins, the open work, the to-dos and a catalogue of
  the docs. Nothing depends on the agent remembering to save.
- **Reads the real transcript.** Claude Code writes every message and tool call to disk.
  The journal reads that file instead of keeping a copy, so the agent can search every
  session of a piece of work by line number, and read back exactly the stretch a summary
  replaced.
- **Enforces it with hooks.** An edit with nothing declared is refused. A context warning
  demands a decision before anything else runs. Work the agent promised "later" in words
  is parked or the next call is refused. These are mechanisms, not suggestions.
- **Lets the agent work on its own.** Switch a to-do list to auto and the agent works
  through it, decides what it can, parks the questions it cannot answer, and stops when
  everything left needs you. Answer from your terminal and it picks up where it left off.

## Install

In the root of your project, with `git` and `python3` available:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

This creates `.journal/` in your project, wires the hooks into `.claude/settings.json`
next to anything already there, installs the `journal` skill for the agent, and puts a
`journal` command in `~/.local/bin` that works in any shell. If that folder is not on
your PATH the installer tells you the one line to add; `.journal/journal.py` works
regardless. Then:

    journal verify

tells you it is wired and, once a hook has run, that it is live. Commit `.journal/` with
your project so your team shares the journal.

To upgrade later, run `journal upgrade`. The agent is told when a new version is out.

## Features

### Work

The agent declares each piece of work in a sentence before it starts, adds notes
as it goes, and closes it when done. What is open is shown to every session, so nothing is
left half-done without a trace.

### To-dos

Work put off for later, one file each with a title and a brief. The agent
parks a to-do when you ask for something while it is busy with something else, and picks
it up when you say so. A to-do can be marked as needing your answer; you answer from the
terminal and the agent is told at its next stop.

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

### Tracks

Separate lines of work, each with its own pins and to-dos. Switch tracks with
one command; rules and docs are shared across all of them.

### Tags

Every message the agent writes starts with a tag: a discovery, a correction,
something it is blocked on, information, or a plain reply. That makes the transcript
readable by kind, and lets the journal show you only what mattered.

### Reading back

The conversation since the last compaction, the exact stretch a summary
replaced, your own words in full, and a search across every session of the track, all
cited by line number.

### Context warnings

At 50, 70, 90 and 95 percent of the context window the agent is
warned, shown what is filling the context, and required to decide what must survive
before it does anything else.

## Commands

You and the agent use the same commands: the agent from its shell while it works, you
from your terminal. Commands that only make sense for the agent are marked (agent).

### Status

    journal                              track, rules, pins, work, to-dos, docs, context
    journal open                         the open work, with its notes
    journal tracks                       every track, the current one marked
    journal verify                       wired, and fired in this session?
    journal help <verb>                  what one command does

### Work

    journal start "<the work>"           declare it; edits are refused until then (agent)
    journal update "<what moved>"        add a note to the open work (agent)
    journal end "<the same words>"       close it (agent)

### To-dos

    journal todo                         the list
    journal todo <n>                     one, with its brief
    journal todo "<title>" --brief       park work for later; brief from stdin
    journal todo start <n>               pick it up as the open work (agent)
    journal todo done <n> "<how>"        close it without starting it
    journal todo drop <n> "<why>"        abandon it, on the record
    journal todo ask <n> "<question>"    it needs the user; the list moves on (agent)
    journal todo answer <n> "<answer>"   answer it; the agent is told at its next stop
    journal todo auto on|off             on: the agent works through the list itself

### Pins and rules

    journal pins                         the pins on this track
    journal remember "<claim>"           pin a fact; --doc=<n> cites a doc
    journal pins <n> --full              the conversation around where a pin was written
    journal strike <n> "<why>"           retire a pin that stopped being true
    journal promote <n>                  lift a pin into a rule
    journal rules                        the rules
    journal rule "<ruling>"              a rule for every track
    journal rule --strike <n> "<why>"    retire a rule
    journal nothing "<why>"              after a context warning: nothing to pin (agent)

### Docs

    journal docs                         the catalogue
    journal docs <n>                     read a doc; <n>.<p> reads one part
    journal docs add "<title>" --abstract="<one line>" --brief
                                         a new doc; the intro from stdin
    journal docs part <n> "<title>" --brief
                                         add a part: a section, a report
    journal docs strike <n>.<p> "<why>"  drop a part; kept under struck/
    journal docs final <n>               mark it settled
    journal docs supersede <n> by <m>    point readers of an old doc at the new one
    journal docs index                   catalogue markdown already in .journal/docs/
    journal docs search <term>           search every line of every doc

### Reading back

    journal conversation                 what was said since the last compaction
    journal conversation --back=1        the stretch the last summary replaced
    journal user                         the user's own words, in full
    journal search <term>                every mention on this track, every session

### Tracks and maintenance

    journal switch "<name>"              park this track, pick up another; --back returns
    journal settings                     every setting and where it came from
    journal version                      the installed version; is a newer one out?
    journal upgrade                      pull the latest and print what changed

## The tags you will see

Every message the agent writes now starts with a tag. That is the journal at work, not
the agent being odd. The tag says what kind of message it is, and because it is part of
the message it lands in the transcript, where the journal uses it to find what mattered
without anyone filing anything.

    [!discovery]    something real it did not know: a cause, a constraint, a measurement
    [!correction]   something it had wrong is now right
    [!blocked]      it cannot proceed, and says on what
    [!info]         something happening that is not work progress: an agent started, a build running
    [!reply]        a plain answer to what you asked; routine, and skipped when reading back

`journal conversation` shows the tagged messages and counts the routine ones.

## What the hooks enforce

- **An untagged message** at a stop: held once and told the tags.
- **An edit with nothing declared**: refused, told to `start`.
- **A context warning** at 50, 70, 90, 95 percent: nothing else runs until the agent has
  pinned something or said, with a reason, that nothing needs pinning.
- **Work deferred in words** after you asked for something: the next tool call is refused
  until it is parked as a to-do.
- **Work still open** at a stop: reminded; in auto mode, at every stop.
- **A pin over 400 characters, or one naming a temporary path**: refused before it runs.
- **A markdown file written by hand**: a one-time hint that docs are catalogued.

Every hold names its way out. Subagents are outside all of it: they cannot write the
journal, are never held, and are handed the rules on their first tool call.

## Where things live

    .journal/record.json      pins, rules, work, tracks — committed
    .journal/todo/<track>/    one file per to-do — committed
    .journal/docs/            the docs, one folder each — committed
    .journal/settings.json    only what you changed from the defaults
    .journal/runtime/         the hooks' own bookkeeping, per transcript — ignored by git

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
- **Tracks.** Session starts and track switches leave marks in the transcript, so the
  journal knows which lines belong to which track and can search one track across every
  session.
- **Compaction.** A summary keeps what was done and drops what was decided; the transcript
  keeps everything. After a compaction the agent gets the record back and is pointed at
  the exact stretch the summary replaced.
- **Hooks.** Five Claude Code hooks do the enforcing: at session start, at each prompt,
  before and after each tool call, and at each stop.
- **Files.** Pins, rules, work and tracks in `.journal/record.json`, a file per to-do, a
  folder per doc. Committed, so the team and every later session read the same journal.

## Settings

`.journal/settings.json` holds only what you change; everything else is at its default.
`journal settings` lists them all. The ones worth knowing:

    context_window       the context window the warnings are measured against;
                         learned automatically at the first compaction, set this to override
    context_warn_ladder  where the warnings fire, default [0.5, 0.7, 0.9, 0.95]
    pin_max_chars        the cap on a pin, default 400
    stall_calls          tool calls on one to-do without progress before the agent is nudged, default 40
    docs_dir             where docs live, default .journal/docs
    silenced             names of nudges to switch off, e.g. ["tool_cost", "markdown_hint"]
