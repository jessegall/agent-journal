# agent-journal

The journal drives coding agents (Claude Code and Codex) and shows you what they do in a viewer in your browser. It
hears every move an agent makes, keeps the project's state in a `.journal` folder beside your code, and tells the
agent what to do next at the moments it would get wrong, so the next session picks up where the last one stopped.

## What it holds

- **Tasks and plans.** An agent works on declared tasks and logs where it stands. A plan is phases of tasks.
- **Chat, questions and dumps.** You leave messages in the viewer or on a paired phone. An agent asks a question with
  choices when it needs a decision. A dump is notes and files you pour in for the agent to file as rows.
- **Memory.** Facts, rules and reminders reach the agent at every start and after every compaction.
- **Workers and reviews.** A builder hands tasks to workers, each in its own git worktree; a worker proves each point of
  its task and its work is merged only once each proof is checked.
- **Processes.** Long shell lines move to the background; every output is numbered so the agent reads the part it needs.
- **Documents, reports, sequences and templates**, **phones** and **share links**, and **plugins**.

## Install

From the root of your project, with Python 3.14 or newer and the release's `install.sh`:

    sh install.sh

This makes `.journal/version-5.db`, copies the code into `.journal/src` and writes the hooks of Claude Code
(`.claude/settings.local.json`) and Codex (`.codex/hooks.json`). It starts nothing. Run the same line again and it
says it is installed and changes nothing. A project that holds a version 4 journal is left as it is and told to
upgrade (see below).

Then start your agent under the journal:

    journal launch claude

or `journal launch codex`. A launch with `journal launch claude --worktree <name>` works in its own git worktree and
branch; `journal worktree list` names them and `journal worktree remove <name>` removes one you are done with. To see the
viewer, run:

    journal viewer

It prints the link to the viewer of the environment you run it in.

## Upgrade from version 4

Version 4's `.journal/journal.db` is moved into version 5; nothing of it is deleted. Close your agent sessions first,
then, from the project's root:

    sh install.sh upgrade --dry-run

prints, for every module, how many rows would move and what would stay behind, and changes nothing. When the counts
look right:

    sh install.sh upgrade --yes

copies the version 4 database to `.journal/version-4/<version>/journal.db` and checks the copy, moves the rows, moves
version 4's own files into `.journal/version-4/`, and switches the hooks of Claude Code and Codex to version 5 (the old
settings files are kept in `.journal/version-4/hooks`). Without `--yes` it prints the counts and asks once. The
upgrade is refused while a journal server answers (stop it with `journal server stop`), and a failed run can be
run again: it finishes from the module that failed.

The way back:

    sh install.sh restore

asks once (`--yes` goes on without asking), puts the backup back as version 4's `journal.db`, version 4's hooks and code beside it, and sets the version 5
database aside as `version-5.<date>.db`. It checks the backup first and refuses one that fails its integrity check.

[The upgrade guide](docs/upgrade-from-version-4.md) says what moves, what waits for its module and how plugins come along.

## Commands

Every line is `journal <thing> <verb>`; `journal <thing> --help` lists its verbs.

- Work: `task`, `plan`, `phase`, `question`, `message`, `dump`, `memory`, `doc`, `report`, `sequence`, `template`.
- Agents: `agent`, `worker`, `proof`, `review`, `process`, `output`, `check`.
- Setup: `environment`, `setting`, `plugin`, `phone`, `share`, `skill`.
- The journal itself: `server stop`, `viewer`, `launch`, `worktree`.

## Tests

    sh scripts/run_tests.sh
