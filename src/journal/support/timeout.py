from dataclasses import dataclass, replace
from typing import ClassVar


@dataclass(frozen=True)
class Timeout:
    """A span a state waits out, in seconds, tool uses, edits or context marks: started or reset at a moment counted in that unit, and asked at a later moment whether it has passed."""

    SECONDS: ClassVar[str] = "seconds"
    TOOL_USES: ClassVar[str] = "tool_uses"
    EDITS: ClassVar[str] = "edits"
    CONTEXT_THRESHOLDS: ClassVar[str] = "context_thresholds"

    amount: float
    unit: str
    start: float = 0.0

    @classmethod
    def minutes(cls, count: float) -> "Timeout":
        return cls(count * 60, cls.SECONDS)

    @classmethod
    def seconds(cls, count: float) -> "Timeout":
        return cls(count, cls.SECONDS)

    @classmethod
    def tool_uses(cls, count: int) -> "Timeout":
        return cls(count, cls.TOOL_USES)

    @classmethod
    def edits(cls, count: int) -> "Timeout":
        return cls(count, cls.EDITS)

    @classmethod
    def marks(cls, count: int) -> "Timeout":
        return cls(count, cls.CONTEXT_THRESHOLDS)

    @classmethod
    def parsed(cls, data: dict) -> "Timeout":
        return cls(**data)

    def started(self, moment: float) -> "Timeout":
        return replace(self, start=moment)

    def is_elapsed(self, moment: float) -> bool:
        return moment - self.start >= self.amount
