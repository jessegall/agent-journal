from functools import cache
from dataclasses import dataclass
from core.base.change.event_pattern_error import EventPatternError


ANY = "*"
ALTERNATIVE = "|"
EVENT_PARTS = 2
@dataclass(frozen=True)
class EventPattern:
    """An event name or a pattern of one, such as task.start, task.*, *.delete or *, several of them joined by |,
    and whether an event matches it."""

    text: str

    def __post_init__(self) -> None:
        for pattern in self.text.split(ALTERNATIVE):
            parts = pattern.split(".")
            if pattern != ANY and (len(parts) != EVENT_PARTS or not all(parts)):
                raise EventPatternError(f"{self.text} is no event pattern: write model.change, either part may be *, or * alone, several joined by |")

    @cache
    def matches(self, event: str) -> bool:
        return any(self.matches_one(pattern, event) for pattern in self.text.split(ALTERNATIVE))

    @staticmethod
    def matches_one(pattern: str, event: str) -> bool:
        if pattern == ANY:
            return True
        return all(pattern_part in (ANY, event_part) for pattern_part, event_part in zip(pattern.split("."), event.split("."), strict=True))
