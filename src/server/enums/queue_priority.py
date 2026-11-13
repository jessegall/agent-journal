from enum import IntEnum

from engine.enums.execution_priority import ExecutionPriority


class QueuePriority(IntEnum):
    """Who goes first in the server's queue, the lowest number first."""

    MAIN_AGENT_HOOK = 0
    AGENT_HOOK = 1

    @property
    def execution_priority(self) -> ExecutionPriority:
        return ExecutionPriority.IMMEDIATE if self is QueuePriority.MAIN_AGENT_HOOK else ExecutionPriority.RESERVED
