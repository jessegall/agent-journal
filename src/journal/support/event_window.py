from dataclasses import dataclass


@dataclass(frozen=True)
class EventWindow:
    """One event a plugin answers before the agent goes on, with the window in milliseconds it promises to answer in; 0 means the journal's ceiling."""

    event: str
    window_ms: int = 0

    @classmethod
    def parsed(cls, data) -> "EventWindow":
        if isinstance(data, str):
            return cls(event=data)
        return cls(event=str(data.get("event", "")), window_ms=int(data.get("window_ms", 0)))

    def limit_ms(self, ceiling_ms: int) -> int:
        return min(self.window_ms, ceiling_ms) if self.window_ms else ceiling_ms

    def as_text(self) -> str:
        return f"{self.event} within {self.window_ms} ms" if self.window_ms else self.event
