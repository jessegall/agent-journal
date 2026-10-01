# agent-journal

A project journal, live viewer and phone app for Claude Code and Codex.

Long agent sessions lose decisions when context is compacted, a terminal closes, or another
session takes over. Agent Journal keeps the durable state beside your project: current work,
to-dos, messages, facts, rules, reminders, plans, reports, docs, and the history connecting
them. Every new session receives the part it needs, while the full record stays readable in
plain files, in the browser and on your phone. Claude and Codex use the same record, engine,
viewer, and command line; `journal version` says which one you have.

## Install

From the root of your project, with `git` and `python3` available:

    curl -fsSL https://raw.githubusercontent.com/jessegall/agent-journal/main/install.sh | sh

The installer fetches the package as plain source and packs its Python on your machine into one
file, `.journal/journal.pyz`, with the viewer, skills and hook scripts beside it in `.journal/src`.
It preserves the project record on upgrades, wires each agent it finds, writes that agent's
generated journal skills, installs a `journal` shim in `~/.local/bin` when that directory exists,
injects the journal's law into `CLAUDE.md` and `AGENTS.md`, and runs migrations.

Claude hooks live beside existing settings in `.claude/settings.json`; Codex hooks live in
`.codex/hooks.json`. Hooks contain no journal decisions: they report activity and enforce the
write gate. Features in the engine decide what the agent should hear.

The journal updates itself: every half hour it checks for a newer published version and installs
it (the Updates feature; switch it off in Settings to have the agent told instead). Upgrade by hand
with `journal upgrade`. Release history is in [CHANGELOG.md](src/CHANGELOG.md).

## Start Claude or Codex

    journal claude
    journal codex

These launch the chosen agent under the same supervisor; arguments after the driver name pass
through unchanged. The installed hooks are inert in standalone Claude and Codex sessions: the
launcher marks only the agent process it starts.

The launcher binds the session to an environment (`main` by default), starts this project's viewer
on a free local port, runs the journal engine beside the agent, and keeps a live terminal band with
the agent, its state, context, the work in hand and the viewer's address.

You can also start an agent from the viewer's sidebar or from the phone. With the
`wake_on_message` setting on, writing in an environment where no agent runs starts one there,
resuming the conversation that environment last had, so the same agent reads your message next.

## The viewer

Home is a conversation with the agent. Messages, replies, reactions and receipts share one thread;
a question you ask shows that an answer is on its way until the reply lands. The rail keeps
questions, reports, notifications and to-dos within reach, and a notice can stay pinned above the
chat. The status bar holds the work mode, auto mode and the helpers the agent has out.

Environment pages contain one line of work: to-dos (also as a board of lanes), work, plans,
reports, facts, reminders and settings. Project pages contain rules, docs, tools, checks, plugins,
services and skills. The viewer is live: a change made by the command line, an agent or another
tab arrives without a reload.

The hub shows every journal running on this machine, the running ones first, each expandable to its
environments, with Start and Stop for their agents.

## On your phone

The viewer's phone button shows a code: scan it and the phone app opens the same chat, from
anywhere, over a tunnel whose address never changes. It works as an app on the home screen, keeps
what you write while offline and sends it when the connection returns, and switches between the
journals on your computer. Its agent sheet starts, pauses and stops the agent, picks the work mode
and auto mode, and shows context, usage and the helpers. A watch opens the address from outside
once a minute and restarts whichever part has stopped answering.

## What changes in an agent session

These are engine-backed mechanisms, not prompt suggestions:

- A file write with no declared work is refused. Start a row with `journal todo start <n>`, or
  declare standalone work with `journal work start "..."`.
- Putting work off in prose without filing a to-do is named back to the agent.
- At marks of the context window, writes wait for a decision: a fact, a project-wide rule, or
  `journal nothing "<why>"`. Facts, rules and reminders return as context fills.
- A message you leave is answered before the agent writes anything else, and a message that asks
  something closes only on a written reply.
- Auto mode works through the to-do list without asking; a question only you can answer is filed
  while the agent carries on with other ready work.
- The work mode says how the agent works: hands-on, as orchestrator sending helpers and reviewing
  what they bring back, or solo with no helpers at all.
- Every subagent dispatch names its model and a concrete job; the journal's law refuses one that
  does not.

Hooks only report status or refuse an unscoped write; every other behaviour belongs to a
switchable feature, and Settings lists every line a feature can say to the agent.

## Helpers, boards and critique rounds

A **helper** is an agent on any provider sent for one bounded job: `journal helper dispatch Rhea
"profile the hooks" --provider codex --model <model>`. It works in an environment of its own,
kept out of the lists, and in a worktree cut from the tip of the working branch when it changes
code; its report comes back to the chat, and `journal worktree take` brings its commits home once
it has rebased.

A **board** turns a request into tickets, each run by an agent in its own environment and
worktree, while your agent orchestrates: it reviews plans, passes checkpoints and merges.

A **critique round** sends critics through an app, each with a lens of their own (first-time user,
accessibility, native feel, words, edge cases), and gathers what they find into one report for
the designer: `journal critique round "the new agent sheet"`.

## Checks and commit gates

A check is a script that passes or fails, run by hand or every so many minutes:
`journal check create "the suite passes" --set command="pytest -q" --set every=30`. A failure is
filed and told to the agent; the next pass clears it.

While iterating, `journal check touched <n>` runs only the tests beside what changed. To commit,
`journal check gate <n> "<message>" --paths a,b` runs the whole check in a process of its own and
commits exactly those paths when it passes, then runs the check's follow-up (a push, an install);
the agent is told either way.

## Message tags

Everything the agent writes reaches the chat as a plain message. A tag runs the command it stands
for, with the turn as its text: `[!reply:12]` replies to message 12, `[!log:7]` logs work 7,
`[!todo="the title"]` files a to-do, and `[!await on=("<run id>", "helper:2")]` waits until those
are back. Which tag runs which command is the `tags.runs` setting.

## Plugins and the Chrome extension

A plugin is a repository installed from a GitHub URL or a local path, pinned to a commit. It hears
the journal's events, can answer them, run services of its own (`journal services`) and show
dashboards.

Settings serves a version-matched Chrome extension. With it, **Alt+J** opens the chat over any tab
and **Alt+P** points at a page element; the agent can drive the tab while you leave it at the
wheel.

## Commands

Every record command is a noun and a word:

    journal todo create "write the release notes" --brief "What belongs in them and where to start"
    journal todo start 12
    journal work log 18 "Old rows converted; the links are next because they cite row numbers"
    journal work end 18 --how "The migration landed"
    journal todo done 12 --how "Published with the release"
    journal question ask "Which name should the release use?"
    journal plan start 1

`journal --help` lists the nouns, `journal <noun> --help` the words for one, and
`journal help <word>` prints focused help. The generated `journal` skill carries the same
reference for each agent.
