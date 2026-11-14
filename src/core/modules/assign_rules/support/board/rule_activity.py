from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class RuleActivity:
    """What a rule did lately: the tasks it gave in the last day, whether it ever matched a task, and why it was
    last skipped."""

    given_last_day: int
    has_matched: bool
    last_skip: str

    @property
    def text(self) -> str:
        if not self.has_matched:
            return "Never matched a task"
        return f"Tasks given in the last day: {self.given_last_day}"

    def json(self) -> Mapping[str, object]:
        return {"given_last_day": self.given_last_day, "has_matched": self.has_matched, "last_skip": self.last_skip, "text": self.text}
