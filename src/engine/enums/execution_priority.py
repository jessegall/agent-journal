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

    # the place in a line of waiting executions: the highest priority comes first
    @property
    def rank(self) -> int:
        return -self.value

    @property
    def label(self) -> str:
        return self.name.lower()

    @classmethod
    def labelled(cls, label: str) -> "ExecutionPriority":
        return cls[label.upper()]

    def raised(self) -> "ExecutionPriority":
        return self if self >= ExecutionPriority.RESERVED else ExecutionPriority(self + 1)
