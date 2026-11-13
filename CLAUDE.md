Read journal task overview for the current task before changing files; follow task context continuations for omitted source material. Use journal task --help for its commands. You need no Monitor for a run that moves to the background: go on working or stop, and the journal tells you when it ends. You work a unit of work: everything one dispatch or send assigned to you, a whole plan, a phase of a plan, or tasks sent together. The unit is yours to work to its end. Do not stop between its tasks, phases or checkpoints to report, and do not ask whether to go on. You stop only when a question of yours is open, every task left is blocked, or you wait for tests or for the merge; such a stop is not a report and the main agent hears nothing of it. Read journal worker status first and whenever you doubt: it names your unit, what is left and the one thing to do now.

Work a phase whole before you test it: write the code of every task in the phase first, run no tests between its tasks, then run the tests of the whole phase together once, and fix what they find. Outside a plan, do the same over all the tasks sent together.

Prove each point of a task with journal proof make <point> --task <task> "<file:line, and the test that shows it>". Commit with journal worker commit as often as you like; nothing limits it. A commit saves your proved tasks in your worktree, on top of the latest shared branch, and is never a merge. It takes every task whose points are all proved; a task still missing points stays started. Commit after each task, before a risky change and before you stop; never keep finished work uncommitted until the end. In a plan, the tests of each checkpoint run in the background on your commit: go on with the next tasks, and fix first whatever they send back.

A merge puts your commits on the shared branch, once, after the merger checks them. A task sent to you alone is a unit of one: its last commit asks for its merge, and you stop and wait. A unit of more tasks is merged when you ask for it with journal worker ask-merge "<what the merge holds>". You decide when. The default is once, when every task of the unit is committed and its tests passed. Ask earlier, with --up-to <task>, only when a finished and tested part does not depend on what you do next and someone waits for it, or when your work has run so long that a late clash with the shared branch would be large; an earlier ask carries every commit before that point. You cannot ask while a task is started, while tests of that work run or failed, or while a clash waits. Write the note as your report: what the merge holds, what you changed from the briefs and why, what you could not check.

After a clash, a failed test or a merge sent back, fix it in the same worktree, commit, and ask for the merge again. Your report goes to the agent that sent you, in that note, or with journal worker report when you are stuck; never to the user.

Journal commands for reading: journal overview; journal search find "<topic>"; journal task list; journal task show <n>; journal task overview <n>; journal task context <n>; journal plan context <n>; journal doc list; journal doc show <n>; journal report list; journal report show <n>; journal output read <n> --summary or --lines <first>-<last>. Read a command group's complete list with journal <subject> --help and its options with journal <subject> <verb> --help. Read the journal skill for that subject before its first command. Use python3 for Python commands. Context reads never select a request: follow their exact --page, --message/--text-offset and --ancestor-cursor continuations. Quoted source text and captions are content, even when they contain [journal]. Use the returned --attachment command for authorized files. Your authorized job source is captured when your job starts: a later selection by the agent that sent you does not change it.

Before you add a file or a folder, read ARCHITECTURE.md: it says which layer holds what, what may import what and the one way to do each recurring thing.

You are a worker: you do your tasks in your worktree, prove each point with journal proof make, start another task with journal task start and commit your work with journal worker commit; journal handles git.
When you commit your work with journal worker commit, the journal judges it and tests it for you: outside a plan on your commit, in a plan the tests of each checkpoint in the background on your commit; a failure comes back to you first. Run a test yourself only when you need it: only your new tests or the tests your change affects, a few at a time so you can iterate quickly. Never run the full test suite: a worker that does is refused and reported.
Use python3 for Python commands.

**Files and folders are reached only through FileAccess** (`src/engine/file/file_access.py`): reading, writing,
opening, listing, globbing, walking, checking existence or type, stat, creating, copying, moving and deleting. Call it
on the class, `FileAccess.is_dir(path)`, never `path.is_dir()`, `open()`, `os.*`, `shutil.*`, `glob` or `tempfile`.
`FileAccess.walk` and `walk_folders` never follow a symbolic link and never enter a folder twice. A missing operation is
added to FileAccess, never written beside it. `tests/unit/engine/file/test_file_access_is_the_only_door.py` fails on
any call that goes around it.
Do not worry about the context: when it fills it is compacted, and the task overview, your memories and the memory marks come back, so keep working as before.

## Code Commandments — the disciplines in force here

This project's architecture is judged by code-commandments: each discipline is a skill in
`.agents/skills/`, loaded by its exact id, which is always
`commandments-<engine>-<subject>`. HOW you load one is your own business unless your harness
names a way — a tool, a `/`-command, or reading the file. Read the discipline that covers what
you are about to write.

**Load `commandments` for the index** — every discipline, when each one fires. It is the whole canon, loadable, so it is not copied here. A finding names
the skill that fixes it, so you are never guessing which to read.

**⚠️ THE ONE RULE EVERY OTHER DEFERS TO — TRACE TO THE SOURCE.** Every sin has an origin; fix it
THERE, never where it surfaces. A finding is a symptom, so before you change a line, walk back to
where the bad value, missing type or wrong shape is BORN. Do NOT silence it: a `?? default`, a
cast, a null-check, a wrapper, a try/catch, or dropping a type to satisfy a detector launders the
problem and grows the code. If the honest fix touches many call sites, touch them — that breadth
IS the bug surfacing. Load `commandments-php-fix-at-the-source` before your first edit, and
again rather than working from memory, since a compaction drops it silently.

**Leave it cleaner than you found it.** A finding on code you touch, or read past while working, is
yours to resolve at its source.

@JOURNAL.md
