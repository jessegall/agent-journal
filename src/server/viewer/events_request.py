from dataclasses import dataclass

from core.base.change.event_pattern import EventPattern


@dataclass(frozen=True)
class EventsRequest:
    """The environments, resume cursor and followed patterns of a stream; an omitted follow query keeps all events."""

    environments: tuple[str, ...]
    cursor_id: int | None
    patterns: tuple[EventPattern, ...] | None = None

    def matches(self, event: str) -> bool:
        return self.patterns is None or any(pattern.matches(event) for pattern in self.patterns)

    @classmethod
    def parsed(cls, query: dict[str, list[str]], last_event_id: str | None) -> "EventsRequest":
        cursor_text = last_event_id or query.get("cursor", [""])[0]
        patterns = tuple(EventPattern(pattern) for pattern in query["follow"] if pattern) if "follow" in query else None
        return cls(tuple(query.get("environment", [""])), int(cursor_text) if cursor_text.isdigit() else None, patterns)
