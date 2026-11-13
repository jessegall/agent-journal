from enum import IntEnum


class ExecutionPriority(IntEnum):
    """How urgent an execution is inside its lane, the highest first."""

    BACKGROUND = 1
    NORMAL = 2
    AGENT = 3
    RESERVED = 4
    IMMEDIATE = 5

    @property
    def is_unlimited(self) -> bool:
        return self is ExecutionPriority.IMMEDIATE

    def raised(self) -> "ExecutionPriority":
        return self if self >= ExecutionPriority.RESERVED else ExecutionPriority(self + 1)
