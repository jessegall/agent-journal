from enum import StrEnum


class Permission(StrEnum):
    """What a state may allow the agent to do."""

    WRITE_FILES = "write_files"
    RUN_COMMANDS = "run_commands"
    DISPATCH_SUBAGENTS = "dispatch_subagents"
