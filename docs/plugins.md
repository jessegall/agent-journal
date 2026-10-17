# Plugins

A plugin is a folder with a `journal-plugin.json` and a program. The journal runs the program for each event the
plugin hears, sends it one line, and reads one line back. A plugin runs with your account and nothing confines it:
installing one is trusting it.

## The manifest

`journal-plugin.json` names the plugin and what it runs, hears and holds:

```json
{
  "name": "echo",
  "version": "1.0.0",
  "protocol": 1,
  "program": "run.py",
  "hears": ["tool_starting", "tasks.created"],
  "holds": ["tool_starting"]
}
```

- `name`: 2 to 32 lowercase letters, digits and dashes, never one of the journal's own features.
- `protocol`: the version of the protocol it speaks; this journal speaks 1.
- `program`: a path inside the folder, run for each event.
- `hears`: agent events by name (`tool_starting`, `tool_finished`, `idle`, `prompt_submitted`, `session_started`,
  `session_ended`, `compacting`, `subagent_started`, `subagent_ended`, `ticked`) and rows as `<table>.created`,
  `.updated` or `.deleted`, such as `plugins.updated` when its settings change. The secrets, users and MCP server rows are
  never sent, nor a row the plugin wrote itself. A subagent's events come with `subagent` set and are held only at
  `tool_starting`.
- `holds`: the events it hears that it answers before the agent goes on: `tool_starting` and `idle` may be refused,
  `prompt_submitted` and `session_started` only told.
- `skills`: a folder holding one folder per skill with its `SKILL.md`, published under that folder's name, which no
  skill of the journal's or another plugin's may have.
- Every path stays inside the folder, a symlink leading out included.

## How it runs

For each event the program is started in the plugin's folder, in a process group of its own, with the line on its
input. It is given these variables and nothing else of the journal's environment but `HOME`, `LANG`, `LC_ALL`,
`TMPDIR` and `USER`:

- `JOURNAL_ROOT`, `JOURNAL_URL` and `JOURNAL_ENV`: the project, the journal's server and the environment of the event.
- `JOURNAL_PLUGIN` and `JOURNAL_PLUGIN_TOKEN`: its name and the token that makes a `journal` command or an API call
  (headers `X-Journal-Plugin` and `X-Journal-Plugin-Token`) the plugin's own. What it writes is stamped `plugin:<name>`;
  it can never act as you, and a plan is never approved by it.
- `JOURNAL_PLUGIN_DIR`, `JOURNAL_PLUGIN_DATA` (a folder of its own under `.journal/plugin-data/`) and
  `JOURNAL_SETTINGS` (a file with its settings as JSON).
- `PATH` with the `journal` command on it.

An event it holds is answered inside the hook: the plugins holding one event are asked in the order they were
installed and share one deadline, the setting `plugins.deadline` (6 seconds), below the hook's own ten. A plugin is
asked only while the event is not yet held; once the journal or an earlier plugin holds it, the rest hear it after the
reply, and a refusal then is recorded as `plugin_unanswered`. A journal command and the read of a skill always go
through, the refusal's words told instead. Every other event, and every row, is heard after the reply, a row only once
its write has committed.

A time-out, a crash, a non-zero exit or an answer that does not parse is a fault: the event goes through, a
`plugin_fault` entry names the plugin, the event and the words, and at the fifth in a row a card says the plugin is
failing, until a card says it answers again.

## The line in

```json
{"v": 1, "event": "tool_starting", "at": "2026-10-17T18:00:00+00:00", "environment": "main", "state": "working",
 "session": "…", "provider": "claude", "subagent": "",
 "data": {"tool": "Bash", "input": {"command": "ls"}, "writes": false}}
```

A row event's `data` is the row's `table`, `id`, who wrote it (`by`) and, when updated, the fields that `changed`.

## The line out

```json
{"v": 1, "answer": "refuse", "reason": "not on main", "tell": "",
 "cards": [{"kind": "sin", "key": "a.py", "label": "A sin in a.py"}], "commands": ["journal task list"]}
```

- `answer`: `allow`, `refuse` with a `reason`, or `tell` a line. An empty answer is `allow`. Only `tool_starting` and
  `idle` can be refused; at `prompt_submitted` and `session_started` a refusal's reason is told. A plugin holds a
  stop once a turn: once the agent went on because a stop was held, a refusal of the next is recorded unanswered. What it says reaches
  the agent as `[plugin <name>] ...`.
- `cards`: shown in the chat after the reply, each `{kind, key, label, tone, detail}`, its kind one the manifest's
  `cards` names; a card with a `key` replaces the plugin's earlier card of that key.
- `commands`: journal command lines, at most 20, run after the reply as the plugin; each leaves a `plugin_command`
  entry with its exit code. A row a plugin's command writes is heard by the other plugins, and a row their commands
  write in turn by none: past that one step the cut is recorded as `plugin_cut`, so two plugins never answer each
  other forever.
- What it says, its `reason`, `tell` and cards, reaches the agent and the chat with `[journal]` and `[!reply:` made plain
  text and every secret value masked.
- An answer that does not parse is a fault: the event goes through and the fault is recorded. A fault is never a
  refusal.

## From version 3

Every key of a version 3 `plugin.json` and of its answers, and where it went.

**Manifest keys**

- `name`, `version`, `title`, `description`, `journal`: kept as they were.
- `requires`, `setup`, `installed`: kept. A requirement names a program and a hint, setup steps run in order at
  install, and the installed command's answer fills the settings.
- `services`: kept as a list. Each has a name, a command, a restart policy and an optional `when`, and runs under the
  supervisor. `port`, `ready`, `grace` and `show` are dropped, because the journal talks to a service on its socket.
- `settings`, `skills`: kept. A secret setting is a secret of the Secrets feature, filled by you only.
- `env`: dropped. A plugin's program gets a clean environment that names the journal and the plugin. What it needs
  beyond that is a setting or a secret.
- `on` (handlers per event pattern) and `hooks` (each hook sync or async): become `hears` and `holds`. One program
  answers every event it hears, and an event it holds is answered inside the hook.
- `refuse`, `refuse_seconds`, `refuse_socket`: become holding `tool_starting`. One deadline, `plugins.deadline`, covers
  every plugin, and the service's socket replaces the refusal socket.
- `reads`: dropped. The line for `tool_starting` says whether the tool `writes`, and the plugin decides for itself.
- `events` (a plugin's own kinds of card, each with a title and a tone): become `cards`.
- `load` (skills the agent must load at an event): dropped. A plugin's skills are published with the journal's, and
  the skills feature requires them like any other.
- `command` (a command of the plugin's own under `journal`): dropped. A plugin acts through the journal's own commands,
  as itself.
- `dashboards`: kept as one `dashboard`.
- `pages` (pages a service served inside the viewer): dropped. The viewer serves no plugin's code.
- `chat` (rules rewriting the agent's chat text): dropped. The journal never rewrites what the agent wrote.
- `cancels` (a command run when an event was cancelled): dropped. Nothing in version 4 cancels an event after the
  hook's reply.
- `fits` (the languages and files a plugin is for): dropped. A service's `when` starts it only where it applies, and
  installing a plugin is your choice.

**Answer keys**

- `whisper`, `say`: become `tell`, said as `[plugin <name>] ...`.
- `notify`, `notice`: become `cards`.
- `todo`: becomes a journal command, such as `journal task create`.
- `hold`: becomes `refuse` with a `reason`.
- `raise` and its `settle`: become a card with a `key`, which a later card of the same key replaces.
- `settings`: dropped from the answer. Settings change through `journal plugin configure` and the Plugins page.

**The host**

- The queue file a plugin wrote answers into: becomes the answer to the line, applied after the reply.
- The HTTP handler a plugin posted to, and its token: become the plugin token. A `journal` command or an API call
  that carries the token is the plugin's own.
- The polling host that ran each plugin: dropped. The journal runs a plugin's program for each event, or asks its
  service.
