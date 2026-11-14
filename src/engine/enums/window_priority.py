from enum import IntEnum

from engine.enums.execution_priority import ExecutionPriority


class WindowPriority(IntEnum):
    """How soon a window's requests run: FIRST does not wait for hooks, NORMAL waits behind them up to a limit."""

    FIRST = 0
    NORMAL = 1

    @property
    def execution_priority(self) -> ExecutionPriority:
        return ExecutionPriority.IMMEDIATE if self is WindowPriority.FIRST else ExecutionPriority.NORMAL
