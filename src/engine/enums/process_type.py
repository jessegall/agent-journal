from enum import StrEnum

from engine.enums.command_category import CommandCategory


class ProcessType(StrEnum):
    """What kind of run a process is. Hooks, reading, writing and searching have priority 0: they leave the
    queue at once and never move to the background. A quick kind, such as the journal's own version control
    status, takes no place in the queue and is stopped at its time limit like every run. The rest wait for a
    place."""

    HOOK = "hook"
    READ = "read"
    EDIT = "edit"
    SEARCH = "search"
    JOURNAL = "journal"
    QUICK = "quick"
    SHELL = "shell"
    MERGE = "merge"
    PLUGIN = "plugin"
    GRAPHIFY = "graphify"

    @property
    def is_priority_zero(self) -> bool:
        return self is ProcessType.HOOK or self.category.is_priority_zero

    @property
    def is_quick(self) -> bool:
        return self is ProcessType.QUICK

    @property
    def takes_place(self) -> bool:
        return not (self.is_priority_zero or self.is_quick)

    @property
    def is_backgroundable(self) -> bool:
        return not self.is_priority_zero

    @property
    def category(self) -> CommandCategory:
        return PROCESS_CATEGORIES[self]


PROCESS_CATEGORIES = {ProcessType.HOOK: CommandCategory.JOURNAL, ProcessType.READ: CommandCategory.READ, ProcessType.EDIT: CommandCategory.EDIT,
                   ProcessType.SEARCH: CommandCategory.SEARCH, ProcessType.JOURNAL: CommandCategory.JOURNAL, ProcessType.QUICK: CommandCategory.PROCESS,
                   ProcessType.SHELL: CommandCategory.PROCESS, ProcessType.MERGE: CommandCategory.VERSION_CONTROL, ProcessType.PLUGIN: CommandCategory.CHECK,
                   ProcessType.GRAPHIFY: CommandCategory.BACKGROUND_JOB}
