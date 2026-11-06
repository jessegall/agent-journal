from enum import StrEnum


class ChatMarkVariant(StrEnum):
    """What an exception mark says happened: the journal failed on a command, a listener failed on an event, or a
    tick of its clock cost too much."""

    COMMAND_FAILED = "command failed"
    LISTENER_FAILED = "listener failed"
    TICK_COSTLY = "tick costly"
