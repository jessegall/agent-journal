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
  `session_ended`, `compacting`, `subagent_started`, `subagent_ended`, `ticked`, `plugin.updated`) and rows as
  `<table>.created`, `.updated` or `.deleted`. The secrets and MCP server rows are never sent.
- `holds`: the events it hears that it answers before the agent goes on: `tool_starting` and `idle` may be refused,
  `prompt_submitted` and `session_started` only told.
- Every path stays inside the folder.

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

- `answer`: `allow`, `refuse` with a `reason`, or `tell` a line. An empty answer is `allow`.
- `cards`: shown in the chat, a card with a `key` replacing the earlier one of that key.
- `commands`: journal command lines run as the plugin, at most 20.
- An answer that does not parse is a fault: the event goes through and the fault is recorded. A fault is never a
  refusal.
