from enum import StrEnum

from engine.enums.command_category import CommandCategory


class ProcessKind(StrEnum):
    """What kind of run a process is. Hooks, reading, writing and searching have priority 0: they leave the queue at
    once and never move to the background. A quick kind, such as the journal's own git status, takes no place in the
    queue and moves to the background only once it runs past its time limit. The rest wait for a place."""

    HOOK = "hook"
    READ = "read"
    WRITE = "write"
    SEARCH = "search"
    JOURNAL = "journal"
    QUICK = "quick"
    SHELL = "shell"
    MERGE = "merge"
    PLUGIN = "plugin"

    @property
    def is_priority_zero(self) -> bool:
        return self is ProcessKind.HOOK or self.category.is_priority_zero

    @property
    def is_quick(self) -> bool:
        return self is ProcessKind.QUICK

    @property
    def takes_place(self) -> bool:
        return not (self.is_priority_zero or self.is_quick)

    @property
    def can_go_to_background(self) -> bool:
        return not self.is_priority_zero

    @property
    def category(self) -> CommandCategory:
        return KIND_CATEGORIES[self]


KIND_CATEGORIES = {ProcessKind.HOOK: CommandCategory.JOURNAL, ProcessKind.READ: CommandCategory.READ, ProcessKind.WRITE: CommandCategory.EDIT,
                   ProcessKind.SEARCH: CommandCategory.SEARCH, ProcessKind.JOURNAL: CommandCategory.JOURNAL, ProcessKind.QUICK: CommandCategory.PROCESS,
                   ProcessKind.SHELL: CommandCategory.PROCESS, ProcessKind.MERGE: CommandCategory.VERSION_CONTROL, ProcessKind.PLUGIN: CommandCategory.CHECK}
