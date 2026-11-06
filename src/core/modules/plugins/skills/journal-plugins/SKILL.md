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
- A plugin's input line names the `checkout` of the agent, and an event about a file names the `file`. A plugin never works
  out a checkout. `relative` is the name of a file, the same in the project and in every worktree, so match files on it
  and nothing else. Every absolute path is a real path. Fields are added; a change of meaning raises `v`.
- `journal plugin checkout`, `journal plugin changes [--since <commit>]` and `journal plugin file <relative> [--from
  checkout, project or base]` answer the same for an agent. A plugin or a person may name any agent with `--agent`; an agent
  names only itself, and reads the project only in the folders plugins declare in `project_reads`. A name that is not
  there exits with code 4.
- `journal plugin run [--agent <n>] [--read-only] -- <command>` runs a command at the root of a checkout with the sandbox of
  its agent. Only a plugin or a person may call it.
- `journal plugin record <name>` shows what it did, its newest outputs and its last fault;
  `journal plugin services` shows whether each service runs.
- `journal plugin settings <name>` lists its settings; `journal plugin dashboard <name>` reads its dashboard.
