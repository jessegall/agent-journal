from enum import IntEnum


class QueuePriority(IntEnum):
    """Who goes first in the server's queue, the lowest number first."""

    MAIN_AGENT_HOOK = 0
    AGENT_HOOK = 1
