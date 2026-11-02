---
name: journal-plugins
description: See what plugins do and propose one for the user to install; read it before the first plugin command of a session
---

# Plugins

A plugin adds rules, services, skills and a dashboard to the journal from a folder of its own.

- Installing, switching on or off, configuring and removing are the user's. You upgrade one, and you propose one:
  `journal plugin propose <folder> --why "<what for>"`.
- `journal plugin list` shows each one, on or off, with its version; `journal plugin latest <name>` says whether its
  source has a newer release; `journal plugin upgrade <name>` shows what changes in what it runs, and `--yes` applies it.
- `journal plugin preview <source>` shows everything a plugin would run, before it is installed.
- `journal plugin record <name>` shows what it did, its newest outputs and its last fault;
  `journal plugin services` shows whether each service runs.
- `journal plugin settings <name>` lists its settings; `journal plugin dashboard <name>` reads its dashboard.
