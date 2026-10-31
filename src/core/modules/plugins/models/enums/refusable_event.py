from enum import StrEnum


class RefusableEvent(StrEnum):
    """The version 4 events a plugin that answers them may refuse; at any other its refusal is only told."""

    TOOL_STARTING = "tool_starting"
    COMMAND_STARTING = "command_starting"
    FILE_EDITED = "file_edited"
    IDLE = "idle"
