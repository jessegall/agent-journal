from dataclasses import dataclass


@dataclass(frozen=True)
class EventListeners:
    """An event a change would raise, with the listeners registered for it."""

    event: str
    listeners: list[str]
