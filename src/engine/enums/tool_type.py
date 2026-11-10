from enum import StrEnum


class ToolType(StrEnum):
    """The category of an agent program's tool, as the Go hook program sorts its tool names."""

    SHELL = "shell"
    MONITOR = "monitor"
    EDIT = "edit"
    NEW_FILE = "write"
    READ = "read"
    SEARCH = "search"
    AGENT = "agent"
    QUESTION = "question"
    UNCATEGORISED = "other"

    @property
    def reads_files(self) -> bool:
        return self in (ToolType.READ, ToolType.SEARCH)

    @property
    def writes_files(self) -> bool:
        return self in (ToolType.EDIT, ToolType.NEW_FILE)
