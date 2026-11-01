from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class HookNumber:
    """What one kind of hook has cost so far: how many ran, their average and slowest time, and their average
    points."""

    hook: str
    count: int
    total_ms: int
    slowest_ms: int
    total_points: int

    def json(self) -> Mapping[str, object]:
        return {"id": self.hook, "hook": self.hook, "count": self.count, "average_ms": self.total_ms // max(self.count, 1), "slowest_ms": self.slowest_ms, "average_points": self.total_points // max(self.count, 1)}
