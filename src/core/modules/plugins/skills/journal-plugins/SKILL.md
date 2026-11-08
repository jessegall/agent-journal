---
name: journal-plugins
description: See what plugins do, install and upgrade them or propose one to the user; read it before the first plugin command of a session
---

# Plugins

A plugin adds rules, services, skills and a dashboard to the journal from a folder of its own.

- `journal plugin install`, `enable`, `disable`, `configure` and `remove` change a plugin. To let the user decide first,
  propose one: `journal plugin propose <folder> --why "<what for>"`.
- `journal plugin list` shows each one, on or off, with its version; `journal plugin latest <name>` says whether its
  source has a newer release; `journal plugin upgrade <name>` shows what changes in what it runs, and `--yes` applies it.
- `journal plugin preview <source>` shows everything a plugin would run, before it is installed.
- A plugin's input line lists the agent's loaded skills in `skills`; `require_skills` in its answer makes the agent load one of its own.
- A plugin's input line names the agent's `role` and the `window_ms` it runs under, null for no limit.
- A plugin's input line names the `checkout` of the agent, and an event about a file names the `file`. A plugin never works
  out a checkout. `relative` is the name of a file, the same in the project and in every worktree, so match files on it
  and nothing else. Every absolute path is a real path. Fields are added; a change of meaning raises `v`.
- `journal plugin checkout`, `journal plugin changes [--since <commit>]` and `journal plugin file <relative> [--from
  checkout, project or base]` answer the same for an agent. A plugin or a person may name any agent with `--agent`; an agent
  names only itself, and reads the project only in the folders plugins declare in `project_reads`. A name that is not
  there exits with code 4. `journal plugin path <absolute>` gives a path's relative name and its checkout, and
  `--since base` is the commit the checkout was cut from.
- `journal plugin config <name>` prints a plugin's config as the project holds it, with its version; `--set
  <pointer>=<value>` or `--stdin` changes it, checked against the plugin's schema. A change raises `plugin.config_changed`.
- `journal plugin run [--agent <n>] [--read-only] -- <command>` runs a command at the root of a checkout with the sandbox of
  its agent. Only a plugin or a person may call it.
- `journal plugin card <name> --label "<one line>" --detail "<text>" [--tone good|warn|danger|note|muted]` shows a card in the
  chat of the agent that ran it, its detail folded: a plugin's own command or alias posts its result this way.
- `journal plugin record <name>` shows what it did, its newest outputs and its last fault, and `--inputs` the last lines it
  was sent; `journal plugin services` shows whether each service runs.
- `journal event keys` lists every event by its key. A manifest's `listen` list names a key with a script for any of three
  forms, and `journal plugin events <name>` shows how each entry stands. `journal plugin try <name> <key>` runs the script
  for real with the newest event of that key, prints the line and the answer, and applies nothing.
- `guard` runs before a change and can refuse it, and nothing is saved. `"skip": false` on the entry means no
  `--skip-guard plugins.event-guard:<plugin>` passes it; a person can always switch the plugin off.
- `listen` runs during a change. It sees the row uncommitted with `final` false. The commands it answers commit with the
  change; a journal command it runs itself commits at once and stays. Ids are a forecast. Only `commit` promises the change
  happened.
- `commit` runs after the change is committed and cannot stop it.
- A guard or listen script holds no lock, but the caller waits. With no `window_ms` on its entry the journal puts no
  limit on a script, and a hung one is stopped by switching the plugin off. With `"window_ms": <ms>` a script past it is
  stopped: the change goes through unjudged, recorded as the plugin's last fault. A guard on a hook moment keeps the journal's limit.
- `docs/writing-a-plugin.md` is the whole contract for a plugin's author, with a sample in `docs/samples/tidy-worktrees`.
- `journal plugin settings <name>` lists its settings; `journal plugin dashboard <name>` reads its dashboard.
