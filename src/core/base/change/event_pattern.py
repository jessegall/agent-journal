from dataclasses import dataclass

ANY = "*"
EVENT_PARTS = 2


class EventPatternFault(Exception):
    """Raised when an event pattern is neither * nor a model name and a change, each of which may be *."""


@dataclass(frozen=True)
class EventPattern:
    """An event name or a pattern of one, such as task.start, task.*, *.delete or *, and whether an event
    matches it."""

    text: str

    def __post_init__(self) -> None:
        parts = self.text.split(".")
        if self.text != ANY and (len(parts) != EVENT_PARTS or not all(parts)):
            raise EventPatternFault(f"{self.text} is no event pattern: write model.change, either part may be *, or * alone")

    def matches(self, event: str) -> bool:
        if self.text == ANY:
            return True
        return all(pattern_part in (ANY, event_part) for pattern_part, event_part in zip(self.text.split("."), event.split("."), strict=True))
