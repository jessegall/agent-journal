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

This creates `.journal/`, wires the hooks into `.claude/settings.json` next to anything
already there, installs the agent's skills, and puts a `journal` command in
`~/.local/bin`. `journal verify` tells you it is wired.

## Start the agent

    journal claude

**This is the command to run.** It starts Claude Code with the journal's channel attached,
so the agent is wired to the journal from its first message and what you do in the web
interface reaches it while it works. It also brings the web interface up if this journal
has none running, and tells you where.

It takes what `claude` takes: `journal claude --continue`, `journal claude --resume=<id>`,
or a first prompt in quotes.

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
- **Work deferred in words is parked.** If it tells you "I'll do that after this" and files
  nothing, its next tool call is refused until it does.
- **A context warning demands a decision.** At 50, 70, 90 and 95 percent of the window,
  nothing else runs until the agent has pinned what must survive — or said, with a reason,
  that nothing needs pinning.
- **A reminder is repeated.** Not once at the start, where it is read and then drifted from:
  at every stop, and every 50 tool calls, for as long as it stands.
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

## Everything else

**[Commands and reference →](COMMANDS.md)** — every command, what each kind of entry is for,
where the files live, and the settings.

The CLI prints it too: `journal help`, or `journal help <verb>` for one command.

To update: `journal update`. The agent is told when a new version is out.
