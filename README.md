# agent-journal

A project journal and live viewer for Claude Code and Codex.

Long agent sessions lose decisions when context is compacted, a terminal closes, or another
session takes over. Agent Journal keeps the durable state beside your project: current work,
to-dos, messages, facts, rules, reminders, plans, reports, docs, and the history connecting
them. Every new session receives the part it needs, while the full record stays readable in
plain files and in the browser.

The current package is 2.60.1. Claude and Codex use the same record, engine, viewer, and command
line.

## Install

From the root of your project, with `git` and `python3` available:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

The installer copies the package into `.journal/`, preserves the project record on upgrades,
wires each agent it finds, writes that agent's generated journal skills, installs a `journal`
shim in `~/.local/bin` when that directory exists, injects the journal's immutable dispatch law
into `CLAUDE.md` and `AGENTS.md`, and runs migrations. Run the installer again, or use
`journal upgrade`, to update an existing installation.

Claude hooks live beside existing settings in `.claude/settings.json`; Codex hooks live in
`.codex/hooks.json`. Hooks contain no journal decisions: they report activity and enforce the
write gate. Features in the engine decide what the agent should hear.

## Start Claude or Codex

    journal claude
    journal codex

These launch the chosen agent under the same supervisor. Arguments after the driver name pass
through unchanged, so commands such as `journal claude --continue` and a quoted first prompt
still work.

The installed hooks are inert in standalone Claude and Codex sessions. The launcher marks only
the agent process it starts, and hooks return immediately when that mark is absent.

The launcher:

- binds the session to the current environment, `main` by default;
- starts this project's viewer on an available local port and opens it in the browser;
- runs the journal engine beside the agent and delivers messages while the agent is idle;
- keeps a live terminal band showing the agent, environment, state, context, active work or
  command, current time, and the clickable viewer URL.

Use `journal serve` to run only the viewer. It reloads changed Python package code on the same
port; frontend assets continue to refresh from disk. Use `journal status` to see the record's
current counts, and `journal verify` to check hooks, engine, viewer, and this session's latest report.

## The viewer

Home is a conversation with the active agent. Messages, answers, reactions, and receipts share
one thread. The rail keeps questions, reports, notifications, and to-dos within reach; Activity
shows what changed while the agent worked. A notice can stay pinned above the chat, and any turn
or unsent composer text can become one.

Environment pages contain the work that belongs to one line of effort: to-dos, work, plans,
reports, facts, reminders, and settings. Project pages contain rules, docs, tools, connections,
checks, plugins, services, and Skills. The Skills page shows every Claude and Codex skill, whether it is loaded or stale,
and lets you ask the agent to load it now or at every start. Search covers the record; Files
collects attachments. The viewer creates, assigns, and removes environments without deleting
their record; the CLI also renames and moves them.

The viewer is live: controller writes made by the CLI, an agent, or another open tab arrive over
the same event stream. Resource inspectors open over the current page, so following a link does
not discard where you were.

The Hub page shows every journal running on this machine as one status bar each, expandable to
every environment with its plans, auto switch and counts, and links to open that journal's viewer
or chat. Viewers find each other on ports 8420–8439 and read one another directly; a journal whose
viewer has stopped stays on the hub, grey, until you forget it. Peers on versions before 2.3.0
are listed but cannot be read.

## What changes in an agent session

These are engine-backed mechanisms, not prompt suggestions:

- A file write with no declared work is refused. Start a row with `journal todo start <n>`, or
  declare standalone work with `journal work start "..."`.
- Putting work off in prose without filing a to-do is named back to the agent.
- At 50, 70, 90, and 95 percent of the context window, writes wait for a decision: create a fact,
  create a project-wide rule, or run `journal nothing "<why>"`.
- Facts and rules are repeated as context fills. A selected rule can also be injected into the
  same managed block in both `AGENTS.md` and `CLAUDE.md` from its viewer control.
- Standing reminders return when the agent comes to rest after work.
- Auto mode is off by default. When enabled in Settings, the next ready to-do is offered whenever
  no work is open. The launcher also selects the provider's automatic approval mode and refuses
  blocking question tools; questions only the user can answer are filed in the journal while the
  agent continues with other ready work.
- Hooks only report status or refuse an unscoped write. Work selection, reminders, retention,
  context decisions, messages, and every other behavior belong to switchable engine features.

- A permission prompt in the agent's terminal shows in the chat, naming the call, with Allow and
  Deny. Settings can restart the agent in the same conversation without permission prompts.
- A command that fails leaves nothing half done: the files it wrote are put back and its events
  are never told.

Every line a feature can say to the agent is declared by that feature under its own name, and
Settings lists them all. A feature can say only its own lines.

An environment is one line of work with its own messages, to-dos, facts, plans, and settings. A
rule and a doc are project-wide. The viewer can bind an idle session to another environment; an
agent never changes branches or environments on its own.

## Message tags

Everything the agent writes reaches the chat as a plain message.

A tag runs the command it stands for, with the turn as its text: `[!reply:12]` replies to
message 12, `[!log:7]` logs work 7, `[!end:7]` ends it, and `[!todo="the title"]` files a to-do with
the turn as its brief. Which tag runs which command is the `tags.runs` setting.

## Checks, suggestions, and plugins

A check is a script that passes or fails, run by hand, by its button, or every so many minutes:
`journal check create "the suite passes" --set command="pytest -q" --set every=30`. A failure is
filed and told to the agent; the next pass clears it.

A suggestion is a change the agent proposes unasked. You accept, adjust, or decline it in the
viewer; nothing waits on it, and a decline is a ruling it does not propose again.

A plugin is a repository installed from a GitHub URL or a local path, pinned to a commit. It hears
the journal's events, can answer them, and can run services of its own; `journal services` lists
them.

## Chrome extension

Settings serves a version-matched extension zip. Download it, unpack it, and load the folder from
Chrome's extension page. The same chat can then float over the viewer or follow you to other tabs;
its bar can be dragged, its corner resized, and its journal and environment switched in place.

With the extension active, **Alt+J** opens the floating chat and **Alt+P** lets you point at a page
element. The composer can also select an element, take a picture, or let the agent drive the tab
while you explicitly leave it at the wheel.

## Commands

Every record command is a noun and a word:

    journal todo create "write the release notes" --brief "What belongs in them and where to start"
    journal todo start 12
    journal work log 18 "Old rows converted; the links are next because they cite row numbers"
    journal work end 18 --how "The migration landed"
    journal todo done 12 --how "Published with the release"
    journal question ask "Which name should the release use?"
    journal question answer 3 --how "Aurora"
    journal rule inject 4
    journal plan continue 1

`journal --help` lists top-level commands. `journal <noun> --help` lists the words for a resource,
and `journal help <word>` prints focused help. The generated `journal` skill carries the same
reference for each agent.

The journal updates itself: every half hour it checks for a newer published version and installs it (the Updates feature; switch it off in Settings to have the agent told instead). Upgrade by hand with `journal upgrade`. Release history is in [CHANGELOG.md](CHANGELOG.md).
