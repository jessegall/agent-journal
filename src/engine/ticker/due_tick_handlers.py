import math
from collections.abc import Collection, Sequence

from engine.ticker.tick_handler import TickHandler


class DueTickHandlers:
    """Decides which tick handlers start at a moment: each whose interval has passed since its last start, or
    since the beginning for one that does not start immediately, and that does not still run. A handler is
    registered once under its label."""

    def __init__(self, handlers: Sequence[TickHandler], began_seconds: float) -> None:
        self.handlers: list[TickHandler] = []
        self.began_seconds = began_seconds
        self.started_seconds: dict[str, float] = {}
        for handler in handlers:
            self.register(handler)

    def register(self, handler: TickHandler) -> None:
        if any(existing.label == handler.label for existing in self.handlers):
            raise ValueError(f"a tick handler named {handler.label} is registered already")
        self.handlers.append(handler)

    def start_due(self, current_seconds: float, running_labels: Collection[str]) -> list[TickHandler]:
        due = [handler for handler in self.handlers if handler.label not in running_labels and self.has_interval_passed(handler, current_seconds)]
        self.started_seconds.update({handler.label: current_seconds for handler in due})
        return due

    def has_interval_passed(self, handler: TickHandler, current_seconds: float) -> bool:
        last = self.started_seconds.get(handler.label, -math.inf if handler.starts_immediately else self.began_seconds)
        return current_seconds - last >= handler.interval.seconds
