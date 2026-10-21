# Plugins

A plugin is a folder with a `journal-plugin.json` and a program. For each event the plugin hears, the journal starts
the program, writes one line of JSON to its input, and reads one line of JSON from its output. The answer may hold the
agent, say it a line, show a card in the chat or run journal commands as the plugin. A plugin runs with your account
and nothing confines it: installing one is trusting it.

Three words used below: to **hold** an event is to answer it before the agent goes on, so the answer can stop a tool
or a stop or reach the agent at once; an **environment** is one of the project's journals, each with its own agent,
named in `JOURNAL_ENV` (most projects have one, `main`); the **supervisor** is the process that runs the agent's
terminal and any services beside it.

## A first plugin

A folder `echo` with two files. `journal-plugin.json`:

```json
{
  "name": "echo",
  "version": "1.0.0",
  "protocol": 1,
  "program": "run.py",
  "hears": ["tool_starting", "prompt_submitted", "tasks.created"],
  "holds": ["tool_starting", "prompt_submitted"],
  "cards": [{"kind": "echoed", "label": "Echoed", "tone": "good"}]
}
```

`run.py`, made executable with `chmod +x run.py`:

```python
#!/usr/bin/env python3
import json
import sys

line = json.loads(sys.stdin.readline())
data = line["data"]
if line["event"] == "tool_starting" and "forbidden" in json.dumps(data["input"]):
    print(json.dumps({"v": 1, "answer": "refuse", "reason": "echo refuses a forbidden tool"}))
elif line["event"] == "prompt_submitted":
    print(json.dumps({"v": 1, "answer": "tell", "tell": "echo heard your prompt"}))
elif line["event"] == "tasks.created":
    print(json.dumps({"v": 1, "cards": [{"kind": "echoed", "key": f"task {data['id']}", "label": f"Echoed task {data['id']}"}],
                      "commands": [f'journal task log {data["id"]} "echoed"']}))
else:
    print("")
```

`journal plugin install ./echo` shows what it would run; `journal plugin install ./echo --yes` installs it. From then
on a tool whose input says forbidden is refused with `[plugin echo] echo refuses a forbidden tool`, each prompt is told
`[plugin echo] echo heard your prompt`, and each new task gets a card in the chat and a log line written as `plugin:echo`.
The journal's own tests run this plugin, from `tests/plugins/echo`.

## The manifest

- `name`: 2 to 32 lowercase letters, digits and dashes, never the name of one of the journal's own features (such as
  `tasks`, `plans`, `messages`, `secrets` or `plugins`); install names the clash when there is one.
- `protocol`: the version of the protocol it speaks; this journal speaks 1.
- `program`: a path inside the folder, run for each event: an executable file, its first line naming its interpreter.
- `hears`: agent events by name (`tool_starting`, `tool_finished`, `idle`, `prompt_submitted`, `session_started`,
  `session_ended`, `compacting`, `subagent_started`, `subagent_ended`, `ticked`), `plugin.updated` when someone
  else changed its own settings, its `data` then being `{"settings": ...}`, and rows as `<table>.created`, `.updated`
  or `.deleted`. The secrets, users and MCP server rows are
  never sent, nor a row the plugin wrote itself. A subagent's events come with `subagent` set and are held only at
  `tool_starting`.
- `holds`: the events it hears that it answers before the agent goes on: `tool_starting` and `idle` may be refused,
  `prompt_submitted` and `session_started` only told. A line told at an event it hears but does not hold reaches the
  agent at its next tool use or prompt; hold the event for the line to come with it.
- `settings`: a path to its settings file, described under Settings.
- `skills`: a folder holding one folder per skill with its `SKILL.md`, published under that folder's name, which no
  skill of the journal's or another plugin's may have. Each is published into `.claude/skills` and `.agents/skills` with
  `plugin: <name>` in its front matter and a `.gitignore` that keeps it out of git. It is taken away when the plugin
  is switched off or removed.
- `services`: processes kept running beside it, each `{"name": ..., "command": ["./serve.py", ...], "restart":
  "always" | "on-failure" | "never", "when": "<shell line>", "answers": true}`. The environment's supervisor runs each
  as `plugin.<plugin>.<service>` with the plugin's clean environment, only where its `when` check passes. It is
  started on install, switch-on and when the journal starts, stopped on switch-off and removal, and restarted by an
  upgrade. A service with `answers` listens on `JOURNAL_PLUGIN_SOCKET` and is asked in place of the program, one line
  in and one line out. With no supervisor, or with its socket gone, the program answers.
- `dashboard`: `{"name": ..., "title": ...}`, a panel opened from a button on the plugin's card, `title` naming the
  button and the panel and `name` the dashboard in its address; the panel is drawn from lines
  the plugin writes with `journal dashboard set <key> "<label>" [--badge <text>] [--tone good|warn|danger|note|muted]
  [--note <text>] [--heading <text>]`: the label is the line's words, the badge a short state beside it, the heading
  the title it is listed under; one line per key, rewritten in place. `journal dashboard unset <key>` and
  `journal dashboard clear` take lines off. The program runs these itself, or names them in its answer's `commands`;
  either way they are the plugin's, and nothing else may write its dashboard. No page of a plugin's runs in the viewer. A
  plugin may instead write the whole dashboard as a document, `dashboards/<name>.json` in its data folder, in the shape
  the viewer's dashboard draws (`{"title", "start", "pages": {id: {"title", "view"}}}`); when that file is there it is shown.
- `requires`: each program it needs, as `{"<program>": {"check": "<shell line>", "hint": "<how to get it>"}}`; without
  a check the program is looked up on the path. A missing one refuses the install with its hint.
- `setup`: steps run in order at install, in its folder with its environment, each `{"name": ..., "run": "<shell
  line>"}`. A step that fails stops the install and leaves nothing behind.
- `installed`: a command run after the setup, whose answer, a JSON object, fills its settings.
- `version`, `title`, `description`: what the Plugins page shows; `journal`: the least journal version it runs on.
- `cards`: the kinds of card it shows, each `{"kind": ..., "label": ..., "tone": "good" | "warn" | "danger" | "note" |
  "muted", "icon": ..., "collapsed": true}`.
- Every path stays inside the folder, a symlink leading out included. A key the journal does not know refuses the
  manifest, by name.

## The line in

One line of JSON, ending in a newline:

```json
{"v": 1, "event": "tool_starting", "at": "2026-10-17T18:00:00+00:00", "environment": "main", "state": "working",
 "session": "…", "provider": "claude", "subagent": "",
 "data": {"tool": "Bash", "input": {"command": "ls"}, "writes": false}}
```

- `event`: the event's name as the manifest's `hears` spells it. `state`: the agent's state at an agent event, one
  word such as `working`, `idle` or `awaiting`, empty at a row event.
- `session`, `provider`, `subagent`: whose event it was, sent with agent events only.
- `data`, by event: `tool_starting` the `tool`, its `input` and whether it `writes`; `tool_finished` the same with its
  `output` and `response`; `prompt_submitted` the `prompt`; `session_started` its `source`; `idle` whether the stop
  was `held_before`; `ticked` the time `at` and the seconds the agent was `quiet_for`; `subagent_started` and
  `subagent_ended` the `subagent`; `plugin.updated` its `settings`. A row event's `data` is the row's `table`, `id`,
  who wrote it (`by`) and, when updated, the fields that `changed`; tables go by their plural names (`tasks`,
  `messages`, `plans`, `questions`, `docs`, `reports`, `facts`, `rules`, `reminders`, `checks`), and a plugin reads the
  row itself with a journal command, such as `journal task list`. `journal <noun> --help` lists a noun's commands.

## The line out

One line of JSON on its output, the last line counting; an empty output is `allow`, and so is an answer with no
`answer` key:

```json
{"v": 1, "answer": "refuse", "reason": "not on main", "tell": "",
 "cards": [{"kind": "sin", "key": "a.py", "label": "A sin in a.py"}], "commands": ["journal task list"]}
```

- `answer`: `allow`, `refuse` with a `reason`, or `tell` a line. An empty answer is `allow`. Only `tool_starting` and
  `idle` can be refused; at `prompt_submitted` and `session_started` a refusal's reason is told. A plugin holds a
  stop once a turn: once the agent went on because a stop was held, a refusal of the next is recorded unanswered. What it says reaches
  the agent as `[plugin <name>] ...`.
- At an event it does not hold, everything applies after the reply: the `cards` and `commands` at once, a `tell` at
  the agent's next tool use or prompt (to the environment's live agent for a row event), and a `refuse` is recorded
  as `plugin_unanswered`.
- `cards`: shown in the chat after the reply, each `{kind, key, label, tone, detail}`. Its `kind` is one the
  manifest's `cards` names, and its tone is the kind's unless it gives one; a kind marked `collapsed` keeps the detail
  to the card's tooltip. A `key` is any text, unique within the plugin, and a card with a key settles the plugin's
  earlier card of that key in place, where it stands in the chat. A card is drawn with the plugin's name on it and
  written as the plugin.
- `commands`: journal command lines, at most 20, run after the reply as the plugin; each leaves a `plugin_command`
  entry with its exit code. A row a plugin's command writes is heard by the other plugins, and a row their commands
  write in turn by none: past that one step the cut is recorded as `plugin_cut`, so two plugins never answer each
  other forever.
- What it says, its `reason`, `tell` and cards, reaches the agent and the chat with `[journal]` and `[!reply:` made plain
  text and every secret value masked.
- An answer that does not parse is a fault: the event goes through and the fault is recorded. A fault is never a
  refusal.

## How it runs

For each event the program is started in the plugin's folder, in a process group of its own, with the line on its
input. It is given these variables and nothing else of the journal's environment but `HOME`, `LANG`, `LC_ALL`,
`TMPDIR` and `USER`:

- `JOURNAL_ROOT`, `JOURNAL_URL` and `JOURNAL_ENV`: the project, the journal's server and the environment of the event.
- `JOURNAL_PLUGIN` and `JOURNAL_PLUGIN_TOKEN`: its name and the token that makes a `journal` command or an API call
  (headers `X-Journal-Plugin` and `X-Journal-Plugin-Token`) the plugin's own. What it writes is stamped `plugin:<name>`;
  it can never act as you, and a plan is never approved by it.
- `JOURNAL_PLUGIN_DIR`, `JOURNAL_PLUGIN_DATA` and `JOURNAL_SETTINGS`: its folder; a folder of its own under
  `.journal/plugin-data/`, kept between runs and across upgrades, where it keeps what it must remember, since each
  event starts the program afresh; and a file with its settings as one JSON object of key to value, the defaults
  filled in, numbers as numbers.
- `PATH`: the journal's own `.journal/bin` with the `journal` command, then `/usr/local/bin`, `/opt/homebrew/bin`,
  `/usr/bin` and `/bin`. A program it needs from elsewhere belongs in `requires`.

An event it holds is answered inside the hook: the plugins holding one event are asked in the order they were
installed and share one deadline, the setting `plugins.deadline` (6 seconds), below the hook's own ten. A plugin is
asked only while the event is not yet held; once the journal or an earlier plugin holds it, the rest hear it after the
reply, and a refusal then is recorded as `plugin_unanswered`. A journal command and the read of a skill always go
through, the refusal's words told instead. Every other event, and every row, is heard after the reply, a row only once
its write has committed.

A time-out, a crash, a non-zero exit or an answer that does not parse is a fault: the event goes through, a
`plugin_fault` entry names the plugin, the event and the words, and at the fifth in a row a card says the plugin is
failing, until a card says it answers again.

## Settings

A manifest's `settings` names a JSON file holding a list of settings, each with its `key`, `title`, `kind` (`text`,
`number`, `flag`, `choice` with its `choices`, `list`, or `secret`), `default` and `help`; a secret has no default:

```json
[{"key": "repeat", "title": "Repeat", "kind": "number", "default": 1, "help": "How many times it says its line"},
 {"key": "token", "title": "Token", "kind": "secret", "help": "The key it sends"}]
```

Install sets each to its default, and the program reads them from `JOURNAL_SETTINGS` as `{"repeat": 1, ...}`.
`journal plugin settings <name>` lists them, and `journal plugin configure <name> <key> <value>` sets one, checked
against its kind; only you configure a plugin. A `secret` setting becomes a secret of the Secrets feature, proposed for
`plugin:<name>`. You fill it on the Secrets page and allow it to the plugin there; only then is its value in the
plugin's environment, under the secret's variable, which the Secrets page shows. In `JOURNAL_SETTINGS` it stands as
`{"secret": <number>}`, never its value. No command ever sets it.

## Installing and managing

`journal plugin install <folder or git address>` prints everything the plugin would run: its program, its services,
the events it hears and holds, its settings and its skills, and the commit it was fetched at. Nothing is installed
until the same line is given `--yes`. A folder is linked and read where it lies; a git address is fetched into
`.journal/plugins/<name>`. Each plugin gets a data folder of its own in `.journal/plugin-data/<name>`. A manifest the
journal refuses installs nothing. `journal plugin list` shows each plugin, whether it is on, and its last fault.

`journal plugin upgrade <name>` shows what changes in what the plugin runs, hears and holds, at its newest commit or
at `--ref <commit>`, and upgrades it with `--yes`. For a fetched plugin it also shows the code: a diff of every file that
changes. When a linked folder's manifest changes, the plugin goes on as it was installed, and a card shows the change
once, until you apply it with `journal plugin upgrade <name> --yes`. `journal plugin disable <name>` and `enable <name>` switch it off
and on for the whole project. `journal plugin remove <name>` takes it out and keeps its data folder; `--purge` deletes
that too. A linked folder is never deleted.

Only you install, upgrade or switch on a plugin. The agent and other plugins are refused, and the agent can
`journal plugin propose <folder or git address> --why "<what for>"`, which shows you a card with the preview. The
agent's writes into `.journal/plugins` are held. The files a plugin runs are hashed when you install, upgrade or
switch it on, and checked before each run. A plugin whose program changed is switched off with a card until you read
the change and switch it on again. A linked folder stays open to the agent; this check is what guards it.

What it did in the journal shows under What it did on its card: each hold and line to the agent (`plugin_said`), each
command it ran, each fault, and every row it wrote, newest first, a row opening from there. What it did outside the
journal, straight to files or to the database, cannot be listed. Switching it off stops its services at once.

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
- `load` (skills the agent must load at an event): dropped. A plugin's skills are published with the journal's;
  requiring one in a state is the skills feature's, said by its conduct.
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
