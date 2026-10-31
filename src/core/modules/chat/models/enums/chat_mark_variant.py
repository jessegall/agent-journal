from enum import StrEnum


class ChatMarkVariant(StrEnum):
    """What a fault mark says happened: the journal failed on a command, or a listener failed on an event."""

    COMMAND_FAILED = "command failed"
    LISTENER_FAILED = "listener failed"
