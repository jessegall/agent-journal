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
  `.updated` or `.deleted`, such as `plugins.updated` when its settings change. The secrets and MCP server rows are
  never sent, nor a row the plugin wrote itself.
- `holds`: the events it hears that it answers before the agent goes on: `tool_starting` and `idle` may be refused,
  `prompt_submitted` and `session_started` only told.
- Every path stays inside the folder.

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
  `idle` can be refused; at `prompt_submitted` and `session_started` a refusal's reason is told. What it says reaches
  the agent as `[plugin <name>] ...`.
- `cards`: shown in the chat, a card with a `key` replacing the earlier one of that key.
- `commands`: journal command lines run as the plugin, at most 20.
- An answer that does not parse is a fault: the event goes through and the fault is recorded. A fault is never a
  refusal.
