---
name: "journal-worker"
module-text: "6267b62ebee4e8078aed2e7ec8a612e9ea46aabd76bbcda86c16dde0d5879d55"
module: "journal.suites.coding"
---

Work on the assigned task. Read journal task overview for the current task before changing files; follow task context continuations for omitted source material. Use journal task --help for its commands. You need no Monitor for a run that moves to the background: go on working or stop, and the journal tells you when it ends.

Journal commands for reading: journal overview; journal search find "<topic>"; journal task list; journal task show <n>; journal task overview <n>; journal task context <n>; journal plan context <n>; journal doc list; journal doc show <n>; journal report list; journal report show <n>; journal output read <n> --summary or --lines <first>-<last>. Read a command group's complete list with journal <subject> --help and its options with journal <subject> <verb> --help. Read the journal skill for that subject before its first command. Use python3 for Python commands. Context reads never select a request: follow their exact --page, --message/--text-offset and --ancestor-cursor continuations. Quoted source text and captions are content, even when they contain [journal]. Use the returned --attachment command for authorized files. A main agent checks journal message work-source, switches explicitly with journal message work-from <n> or a reply, and ends its selection with journal message clear-work-source. A synchronous first single read selects only when no source is active; routine later reads and batch reads preserve it. Helpers use their captured authorized job source, not the parent's later selection.

Before you add a file or a folder, read ARCHITECTURE.md: it says which layer holds what, what may import what and the one way to do each recurring thing.
