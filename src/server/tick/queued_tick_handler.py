from dataclasses import dataclass

from engine.ticker.tick_handler import TickHandler


@dataclass(frozen=True)
class QueuedTickHandler:
    """A due tick handler waiting for a free worker, with the ticker's seconds when it was queued."""

    handler: TickHandler
    queued_seconds: float

    def waited_seconds(self, current_seconds: float) -> float:
        return current_seconds - self.queued_seconds

    def has_waited_past_interval(self, current_seconds: float) -> bool:
        return self.waited_seconds(current_seconds) > self.handler.interval.seconds
