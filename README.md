# agent-journal

The journal is a driver for coding agents, with a viewer in your browser. It runs Claude Code or Codex for you,
keeps it on track, and shows you everything it does.

An agent on its own forgets what it was doing, wanders off the task, stops halfway, and buries what you need to know
in a wall of text. The journal sits beside it and fixes that. It hears every move the agent makes, tells it what to
do next at the moments it would get wrong, and keeps the project's state in a .journal folder beside your code, so the next
session picks up where the last one left off.

## What you get

- **Tasks and plans.** The agent declares what it works on, logs where it stands, and finishes it. A plan is phases
  of tasks you approve. Finishing one task starts the next, and with auto mode on the agent works the list until you stop it.
- **A chat with your agent.** Leave a message in the viewer, or from your phone, and the agent answers it. When it
  needs a decision, it asks a question with choices for you to pick. Drop text or files in a dump, and the agent sorts
  them into tasks, documents and plans.
- **Memory that survives.** Facts, rules and reminders are handed to the agent at every start and after every
  compaction, so it does not relearn your project each session.
- **Conduct you can read.** How the journal treats the agent is a stack of states on its row, shown on the Home page
  with its trail: when it reminds, what it says, what it holds back, each line with the state that said it.
- **Work modes.** As the builder the agent writes the code itself; as the orchestrator it plans, hands every task to a
  worker and reviews what comes back; solo, it does everything alone. You switch modes with the plan bar's buttons,
  and the agent is reminded when it drifts from its mode.
- **Workers and subagents.** The agent hands jobs to workers and subagents, each named, each on the model that fits the job, and
  each coding worker in its own git worktree. A worker proves each point of its task, and its work is merged only once
  each proof is checked. With the setting workers.auto_dispatch on, the journal dispatches the orchestrator's next tasks
  itself, up to workers.auto_dispatch_most workers running; with workers.next_at_clock_out on, work queued for a worker
  in review goes on at once with a fresh worker.
- **Worktree launches.** `journal claude --worktree <name>` gives a launch its own git worktree and branch beside the
  others, all on one journal; a bare `--worktree` makes up a fresh name. Nothing removes a worktree but you, with
  `journal worktree remove <name>`, and a relaunch reopens the same folder and branch.
- **Every command kept.** Long commands move to the background, and each output is numbered, so the agent reads
  the part it needs instead of running the command again. A reader picks the lines worth seeing from an output, such
  as a test run's failures, and shows its progress on a card in the chat.
- **Checks, documents, reports and plugins.** Scripts that pass or fail, knowledge that lasts, write-ups of what
  was checked, and plugins such as Code Commandments that judge the code as it is written.
- **Secrets the agent never sees.** You fill in keys and logins in the viewer; the agent hands a secret to the program
  that needs it, and the value is masked in what the program prints.
- **A library for your team.** A small server holds the sequences, templates, profiles, readers, skills, documents and
  plan outlines your people publish; each journal imports them and updates them. See [The library](docs/library.md).
- **Share links.** Open one document, report or plan to someone outside the team with a read-only link, once you
  accept it in the chat; they can read it and leave comments.

## Install

In a terminal, from the root of your project:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

Then start your agent under the journal:

    journal claude

or `journal codex`. The viewer opens in your browser. That is all.

It needs Python 3.14 and git; where either is missing, the installer offers to install it for you. Running the same line again upgrades the journal. If you switch on
auto-update in the viewer's settings, a new release installs itself.

### Upgrading from version 3

Run the install line above from a plain terminal in the project, not from inside an agent session. It stops the
version 3 journal, keeps it whole in `.journal/version-3`, installs version 4, and the viewer offers to bring
everything across: to-dos become tasks, and plans, documents and the rest come across as they are. From version 3.3.7
on, `journal upgrade --to 4 --yes` does the same, and first checks that Python 3.14 and git are installed.

### Hosting a library server

On a machine you reach over ssh with a key, from your project:

    journal remote install root@203.0.113.5

It installs Docker where it is missing, starts the library server there, and prints the address your team connects
to. Run it in your own terminal, since it may ask for the project's name.

### Windows

Run Claude Code and the journal inside WSL 2, the way Anthropic documents Claude Code on Windows: open your WSL distribution's
terminal, install there with the command above, and work from there. Keep the project on the Linux file system, such as
`~/projects/your-project`, not under `/mnt/c`: the journal watches files and runs many small commands, and both are slow across the
Windows drives. Native Windows, without WSL, is not supported yet.

## How it works

`journal claude` starts a small supervisor that runs your agent in a terminal and keeps the journal's server running
beside it. The agent's hooks post every move to the server, which answers from the stack of states on the agent's
row: a reminder, a line, or a hold. Your messages from the viewer are typed into the agent's terminal. Everything
is kept in `.journal/journal.db`, a SQLite database beside your code.

- [The rules](docs/the-rules.md): every state and every line the journal says, and which class says it, generated
  from the source.
- [The cycle](docs/the-cycle.md): how the journal speaks to the agent, hook by hook.
- [Plugins](docs/plugins.md): how to write a plugin that hears the journal's events and answers them.
- [The library](docs/library.md): hosting a library server, connecting to it, publishing and importing.

## License

The journal is free to use for any noncommercial purpose under the [PolyForm Noncommercial License 1.0.0](LICENSE.md): personal use, study, research, hobby projects, and use by charities, schools and public bodies. Commercial use needs a separate license from the author.
