# agent-journal

The journal is a driver for coding agents, with a viewer in your browser. It runs Claude Code or Codex for you,
keeps it on track, and shows you everything it does.

An agent on its own forgets what it was doing, wanders off the task, stops halfway, and buries what you need to know
in a wall of text. The journal sits beside it and fixes that. It hears every move the agent makes, tells it what to
do next at the moments it would get wrong, and keeps the project's state in a .journal folder beside your code, so the next
session picks up where the last one left off.

## What you get

- **Tasks and plans.** The agent declares what it works on, logs where it stands, and finishes it. A plan is phases
  of tasks you approve. Finishing one task starts the next.
- **A chat with your agent.** Leave a message in the viewer, or from your phone, and the agent answers it. When it
  needs a decision, it asks a question with choices for you to pick.
- **Memory that survives.** Facts, rules and reminders are handed to the agent at every start and after every
  compaction, so it does not relearn your project each session.
- **Workflows you can see and edit.** How the journal treats the agent is drawn as flowcharts: when it reminds,
  what it says, what it holds back. You change them in the viewer.
- **Workers and subagents.** The agent hands jobs to helpers, each named, each on the model that fits the job, and
  each coding worker in its own git worktree.
- **Every command kept.** Long commands move to the background, and each output is numbered, so the agent reads
  the part it needs instead of running the command again.
- **Checks, documents, reports and plugins.** Scripts that pass or fail, knowledge that lasts, write-ups of what
  was checked, and plugins such as Code Commandments that judge the code as it is written.

## Install

In a terminal, from the root of your project:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

Then start your agent under the journal:

    journal claude

or `journal codex`. The viewer opens in your browser. That is all.

It needs Python 3.11 or newer and git. Running the same line again upgrades the journal. If you switch on
auto-update in the viewer's settings, a new release installs itself.
