from dataclasses import dataclass


@dataclass(frozen=True)
class EventsRequest:
    """What GET /api/events asks for: the environment to follow, and the event to start after, which is the
    browser's last event id on a reconnect, the cursor in the query, or none for the newest."""

    environment: str
    cursor_id: int | None

    @classmethod
    def parsed(cls, query: dict[str, list[str]], last_event_id: str | None) -> "EventsRequest":
        cursor_text = last_event_id or query.get("cursor", [""])[0]
        return cls(query.get("environment", [""])[0], int(cursor_text) if cursor_text.isdigit() else None)
