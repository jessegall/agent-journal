# Upgrading from version 4

## Before

Close your agent sessions. Run `sh install.sh upgrade --dry-run` and read the table: one row for each module with
what it would move and what it leaves behind, then the version 4 tables no module claims. A dry run changes nothing.

## The steps of `sh install.sh upgrade --yes`

1. The version 4 database is copied with SQLite's backup interface to `.journal/version-4/<version>/journal.db`, and the
   copy is opened and its row counts compared with the original's. A backup already made is never overwritten, so a
   second run keeps the first.
2. The version 5 database is made, and each module moves its rows in turn, each in a transaction of its own. A move that
   fails is rolled back and the modules before it stay moved; run the upgrade again to finish from the failed one.
3. Version 4's `journal.db` and code are moved into `.journal/version-4/`, so only version 5 is live.
4. The hooks of Claude Code and Codex are switched to version 5. Your own settings in those files stay; the settings
   files as they were are kept in `.journal/version-4/hooks`.
5. A report of the upgrade is kept in `.journal`, and the first chat of the first environment shows one mark with how many
   tasks, plans, messages and memories moved.

If something fails before step 3 your version 4 journal is where it was. If a version 4 `journal.db` appears again after
an upgrade (another machine or session still ran version 4), a further upgrade refuses and keeps the backup.

## What moves

Actors, environments, agents, settings, tasks with their logs and dependencies, plans and phases, messages, memories
(with rules and reminders), questions, documents and reports, sequences, templates, triggers, notices, suggestions,
dumps, command outputs (as processes), file edits, plugins, share links and the viewer's layouts keep their numbers.
What a version 5 table cannot hold is counted in the report: a text cut to a limit, a loop of dependencies, a worker's
history, a chat card version 5 has no mark for.

Phones stay in the backup: pair each phone again from the Phones window.

## What waits for its module

These version 4 tables have no version 5 module yet. They stay whole in the backup and the report lists them as
not claimed: `aliases`, `collections`, `library_items`, `mcp_servers`, `reactions`, `release_messages`,
`scheduled_jobs`, `secrets`, `statistics` and `test_turns`. Version 4's own records (`entries`, `state_transitions`,
`migrations` and the like) stay in the backup too.

## Plugins

A plugin keeps its `journal-plugin.json` and the same protocol: a plugin folder installed in version 4 is read by version 5
as it was. List them with `journal plugin list`; `journal plugin enable <name>`, `disable` and `configure` work as before.

## The way back

    sh install.sh restore

asks once (`--yes` goes on without asking), stops the server, sets the version 5 database aside as `version-5.<date>.db`, puts the backup back as `journal.db` with
version 4's code and hooks, and says what it did. Rows written in version 5 after the upgrade stay in the set-aside file.
