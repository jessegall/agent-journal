from dataclasses import dataclass


@dataclass(frozen=True)
class EventWindow:
    """An event a plugin answers before the agent goes on, and the milliseconds it has to answer it."""

    event: str
    window_ms: int
