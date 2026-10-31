from enum import StrEnum


class ToolType(StrEnum):
    """The category of an agent program's tool, as the Go hook program sorts its tool names."""

    SHELL = "shell"
    EDIT = "edit"
    NEW_FILE = "write"
    READ = "read"
    SEARCH = "search"
    AGENT = "agent"
    QUESTION = "question"
    UNCATEGORISED = "other"
