# agent-journal

A project journal, live viewer and avatar for Claude Code and Codex. Version 4.

The journal keeps a project's durable state beside the code in one SQLite file, `.journal/journal.db`:
tasks, plans, messages, questions, facts, rules, reminders, sequences, workers, checks and the
timeline of everything the agent did. A server beside the agent hears its hooks, decides what the
agent should hear back, and serves the viewer. The agent is a state machine: one flat state at a
time, and the state says what is allowed and what is said.

## Try it

From the root of your project, with `python3`, `git` and `curl` on the path:

    sh /path/to/agent-journal/src/journal.sh setup here
    journal claude

`setup here` makes `.journal/`, wires Claude's hooks (and Codex's where `.codex/` exists), writes the
journal's skills and the agent profiles, puts the journal's law into AGENTS.md, imports it from
CLAUDE.md, and installs a `journal` command in `~/.local/bin`. `journal claude` asks, one screen at a
time, which environment, whether to continue its last conversation and whether to run with the hooks,
then runs Claude under the supervisor with the server beside it and opens the viewer in your browser.
`--env <name>`, `--new`, `--aside`, `--yes` and `--no-open` answer the menu from the command line.
The viewer is at the port in `.journal/port`, 8420 by default, or `JOURNAL_PORT`.

The viewer is version 3's, unchanged: the server answers its API from the new database.

Without the supervisor, `journal serve` runs the server alone and `claude` with
`AGENT_JOURNAL_ACTIVE=1` in its environment reports to it.

## Commands

Every command is `journal <noun> <verb>`; `journal <noun> --help` lists the verbs.

    journal task create "write the notes" --brief "what and where" --start
    journal task log 1 "half done"
    journal task done 1 --how "published"
    journal plan create "release" && journal plan add 1 "tag it" && journal plan start 1
    journal message send "look at the login" / journal message list
    journal question ask "Which name?" --options "alpha, beta"
    journal fact create "the api is on port 9" / journal rule create "Never skip the gate"
    journal sequence create "release" --steps "bump | tag | push" && journal sequence run 1
    journal worker dispatch "Lady Lovelace" "write the parser" --model fast --worktree
    journal check create "the suite" --command "pytest -q" --every 30
    journal trigger create "deploy,release" "check the changelog first" --do instruct
    journal voice choose squire && journal voice me --title Sir --name Jesse
    journal halt now "stuck on the login"

With the server up, `journal` posts the command to it and prints the outcome; no Python starts.

## Developing

    pytest                       # the suite, about five seconds, core only
    cd src/web && npm run build  # the viewer, into src/web/dist (node_modules is shared from v3.bak)

`CLAUDE.md` holds the design philosophy and `NOTES.md` what is decided and what is still open.
`v3.bak/` is version 3, kept as the guide for the rewrite and never imported.
