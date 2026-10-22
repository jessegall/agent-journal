from dataclasses import dataclass, replace
from typing import ClassVar

from journal.support.moment import Moment


@dataclass(frozen=True)
class Timeout:
    """A span a state waits out, in seconds, tool uses, edits or context marks: started or reset at a moment counted in that unit, and asked at a later moment whether it has passed. Combined with spans in other units, it has passed once any of them has, such as five tool uses or thirty seconds, whichever comes first."""

    SECONDS: ClassVar[str] = "seconds"
    TOOL_USES: ClassVar[str] = "tool_uses"
    EDITS: ClassVar[str] = "edits"
    CONTEXT_THRESHOLDS: ClassVar[str] = "context_thresholds"

    amount: float
    unit: str
    start: float = 0.0
    alternatives: tuple["Timeout", ...] = ()

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
        return cls(data["amount"], data["unit"], data.get("start", 0.0), tuple(cls.parsed(alternative) for alternative in data.get("alternatives", ())))

    def combined(self, span: "Timeout") -> "Timeout":
        return replace(self, alternatives=(*self.alternatives, span))

    def reset(self, moment: Moment) -> "Timeout":
        return replace(self, start=moment.value(self.unit), alternatives=tuple(alternative.reset(moment) for alternative in self.alternatives))

    def has_passed(self, moment: Moment) -> bool:
        return self.is_elapsed(moment.value(self.unit)) or any(alternative.has_passed(moment) for alternative in self.alternatives)

    def started(self, moment: float) -> "Timeout":
        return replace(self, start=moment)

    def is_elapsed(self, moment: float) -> bool:
        return moment - self.start >= self.amount
