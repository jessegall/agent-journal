from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class HookNumber:
    """The count and database cost of one type of hook, reader or route."""

    hook: str
    count: int
    total_points: int
    most_points: int

    def json(self) -> Mapping[str, object]:
        return {"id": self.hook, "hook": self.hook, "count": self.count, "average_points": self.total_points // max(self.count, 1), "most_points": self.most_points}
