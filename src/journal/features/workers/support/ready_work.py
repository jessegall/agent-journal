from dataclasses import dataclass


@dataclass(frozen=True)
class ReadyWork:
    """A clocked-out worker's work waiting for the main agent's check: the worker, by number and name, the task it holds, and when it clocked out."""

    worker: int
    name: str
    task: int
    delivered_at: float = 0.0

    def is_waiting(self, time: float, seconds: float) -> bool:
        return time - self.delivered_at >= seconds
