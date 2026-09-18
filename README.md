# agent-journal

A journal for AI coding agents working in your project, built for Claude Code.

When you work with a coding agent for hours or days, things get lost: the context is
compacted into a summary, the session ends, and the next one starts with nothing. This
gives the agent a journal inside your repository — what it is working on, what it put off,
what was decided — and hands it back to every session. Plain files in your repo, so you can
read them, edit them and commit them with your project.

## Install

In the root of your project, with `git` and `python3` available:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

This copies the package into `.journal/`, wires the hooks into `.claude/settings.json` (and
`.codex/hooks.json`) next to anything already there, writes the agent's skills, puts a
`journal` command in `~/.local/bin`, and runs the migrations — an older record is carried
across with every number kept. Running it again, or `journal upgrade`, upgrades.

## Start the agent

    journal claude

**This is the command to run.** It starts Claude Code under the journal's supervisor: an
engine beside the terminal reads the record and types one line into the agent while it is
idle — a message you left, an answer, a reminder, the next to-do under auto mode — in a
tiny vocabulary the agent's skill explains. `journal serve` brings the web interface up.

It takes what `claude` takes: `journal claude --continue`, `journal claude --resume=<id>`,
or a first prompt in quotes.

    journal codex

**The same for Codex.** Claude and Codex are two drivers behind one interface; the hooks of
each are wired into its own config, and the engine treats them alike.

**Hooks report, the engine decides.** The hooks only write the agent's status — idle,
working, waiting, its tool uses, its context — and refuse a write while no work is open.
Everything else is a feature in the engine: reminders said again on idle, rules and pins at
every tenth of the context, a decision demanded at each mark of the window, the next row
offered under auto mode, an untagged reply named once. Every feature is a switch in the
viewer's Settings and its cadence a setting; a silent agent is probed with one Ctrl-C after
two minutes.

## The web interface

`journal claude` starts it; `journal serve` starts one on its own.

The home is a conversation. Everything the agent says to you and everything you say back is
one thread — you write to it from the box at the bottom and it is told at its next stop.
What the agent *did* stays in the Activity column beside it. What is waiting on you sits in
a rail: a question to answer in place, a report to read, work the agent set aside because it
cannot go on without you. Clicking one moves the thread to the turn that raised it.

Everything else in the journal has a page there too — the to-dos, the docs, the pins, the
plans — and opening one from anywhere else swaps it in over what you were reading, rather
than taking you away from it.

## What it does to your session

These are mechanisms, not suggestions, and they are why the agent behaves differently:

- **An edit with nothing declared is refused.** The agent says what it is working on before
  it changes a file.
- **Work deferred in words is named back.** If it tells you "I'll do that after this" and files
  nothing, the engine says so at its next idle moment.
- **A context mark demands a decision.** At 50, 70, 90 and 95 percent of the window (a
  setting), writes are held until the agent has pinned what must survive — or said, with a
  reason, that nothing needs pinning.
- **A reminder is repeated.** Not once at the start, where it is read and then drifted from:
  at every idle moment (or every N tool uses, or every N percent — a setting), for as long as
  it stands.
- **A session starts on no environment.** An environment is a line of work with its own
  pins, to-dos and reminders. There is no default one: the agent picks, or asks.

`journal` on its own shows where things stand.

## The tags you will see

Every message the agent writes starts with a tag. That is the journal at work, not the
agent being odd — the tag is part of the message, so it lands in the transcript, where what
mattered can be found again without anyone filing anything.

    [!discovery]    something real it did not know: a cause, a constraint, a measurement
    [!correction]   something it had wrong is now right
    [!blocked]      it cannot proceed, and says on what
    [!info]         something happening that is not work progress: an agent started, a build running
    [!reply]        a plain answer to what you asked; routine, and skipped when reading back

## Point at what you mean

There is a Chrome extension in `extension/` — the journal's viewer hands it out from its Settings
page, or you can load the folder directly. With it, **Alt+P** puts a crosshair on any page: click an
element and the agent is told what you pointed at — the selector, the page, the element's text, and
a picture of it. **Alt+J** opens the chat as a window over whatever you are looking at.

## Everything else

Every command is a noun and a word: `journal todo add "…"`, `journal question answer 3 --how "…"`,
`journal plan continue 1`. `journal --help` lists the nouns, `journal <noun> --help` the words;
the agent's `journal` skill carries the same reference, generated from the package.

To update: `journal upgrade`. Its changes are in [CHANGELOG.md](CHANGELOG.md).
