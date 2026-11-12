from enum import StrEnum


class CommandCategory(StrEnum):
    """What a shell command is, as the command table names it, and the groups of categories rules ask about."""

    SEARCH = "search"
    READ = "read"
    EDIT = "edit"
    VERSION_CONTROL = "version control"
    TEST_RUN = "test run"
    BUILD = "build"
    BACKGROUND_JOB = "background job"
    CHECK = "check"
    PACKAGE = "package"
    NETWORK = "network"
    PROCESS = "process"
    JOURNAL = "journal"
    UNKNOWN = "unknown"

    @property
    def is_priority_zero(self) -> bool:
        return self in (CommandCategory.READ, CommandCategory.SEARCH, CommandCategory.EDIT)

    @property
    def can_go_to_background(self) -> bool:
        """Reading, writing, searching and journal commands stay in the foreground to their end; a journal command is
        the journal answering the agent, never a run of its own."""
        return not (self.is_priority_zero or self is CommandCategory.JOURNAL)

    @property
    def reads_files(self) -> bool:
        return self in (CommandCategory.READ, CommandCategory.SEARCH)

    @property
    def accesses_files(self) -> bool:
        return self.reads_files or self is CommandCategory.EDIT

    @property
    def is_readonly(self) -> bool:
        return self.reads_files or self is CommandCategory.JOURNAL

    @property
    def has_reader(self) -> bool:
        return not self.is_short

    @property
    def is_short(self) -> bool:
        return self.accesses_files or self is CommandCategory.JOURNAL

    @property
    def is_long_running(self) -> bool:
        return self in (CommandCategory.TEST_RUN, CommandCategory.BUILD)

    @property
    def is_queued(self) -> bool:
        return self.is_long_running or self is CommandCategory.CHECK

    @property
    def is_watched(self) -> bool:
        return self.is_long_running or self in (CommandCategory.CHECK, CommandCategory.BACKGROUND_JOB)

    @property
    def has_result_output(self) -> bool:
        return self.is_watched or self is CommandCategory.PACKAGE
