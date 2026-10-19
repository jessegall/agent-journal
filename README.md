# agent-journal

A project journal, live viewer and avatar for Claude Code and Codex. Version 4.

## Install

In a terminal, from the root of your project:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

Then start your agent under the journal:

    journal claude

or `journal codex`. The viewer opens in your browser. That is all.

It needs Python 3.11 or newer and git. Running the same line again upgrades the journal; with auto-update
switched on in the viewer's settings, a new release installs itself.

## Coming from version 3

Version 3 never moves itself to version 4. When you want to, run `journal upgrade --to 4` in the project,
or say yes to the dialog version 3 shows once version 4 is out. The journal stops, version 4 is installed,
and your whole version 3 journal is kept, untouched, in `.journal/version-3`. The viewer then offers to
bring everything across: messages, tasks (your to-dos), plans, questions, documents, reports, facts,
rules, reminders, comments and the rest. Nothing is lost, and the report it writes says what came across
and what stayed in the backup.

## What it is

The journal keeps a project's durable state beside the code, in one SQLite file at `.journal/journal.db`:
tasks, plans, messages, questions, facts, rules, reminders, sequences, workers, checks, documents and the
timeline of everything the agent did. A server beside the agent hears its hooks, decides what the agent
should hear back, and serves the viewer. You talk to the agent in the viewer's chat; it answers there.

Every shell command the agent runs goes through the journal: it is timed, moved to the background when it
runs long, and kept as a numbered output the agent reads by its number instead of running it again.

## Commands

Every command is `journal <noun> <verb>`; `journal <noun> --help` lists the verbs. The agent uses them;
you rarely need to.

    journal task create "write the notes" --brief "what and where" --start
    journal plan create "release" && journal plan add 1 "tag it"
    journal question ask "Which name?" --options "alpha, beta"
    journal fact create "the api is on port 9"
    journal worker dispatch "Lady Lovelace" "write the parser" --model sonnet --worktree
    journal check create "the suite" --command "pytest -q" --every 30
    journal output read 12 --grep FAILED

`journal claude` and `journal codex` take `--env <name>`, `--new`, `--skip` and `--yes` to answer the
start menu from the command line. The viewer is at the port in `.journal/port`, the first free one from 8420.

## Developing

    python3 -m pytest -q          # the suite
    npm --prefix src/web run build  # the viewer, into src/web/dist
    sh install.sh                 # install this checkout into its own .journal

`CLAUDE.md` holds the design philosophy and `NOTES.md` what is decided and what is still open.
