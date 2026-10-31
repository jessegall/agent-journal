from enum import StrEnum


class CommandCategory(StrEnum):
    """What a shell command is, as the command table names it."""

    SEARCH = "search"
    READ = "read"
    EDIT = "edit"
    VERSION_CONTROL = "version control"
    TEST_RUN = "test run"
    BUILD = "build"
    CHECK = "check"
    PACKAGE = "package"
    NETWORK = "network"
    PROCESS = "process"
    JOURNAL = "journal"
    UNKNOWN = "unknown"
