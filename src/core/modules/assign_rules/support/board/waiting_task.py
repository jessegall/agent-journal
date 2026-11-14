from dataclasses import dataclass

from engine.time.timestamp import HOUR_SECONDS, MINUTE_SECONDS

DAY_SECONDS = 24 * HOUR_SECONDS


@dataclass(frozen=True)
class WaitingTask:
    """The oldest unstarted task a rule gave one target, and how long it has waited."""

    task_id: int
    waited_seconds: float

    @property
    def age(self) -> str:
        if self.waited_seconds < HOUR_SECONDS:
            return f"{int(self.waited_seconds // MINUTE_SECONDS)} min"
        if self.waited_seconds < 2 * DAY_SECONDS:
            return f"{int(self.waited_seconds // HOUR_SECONDS)} h"
        return f"{int(self.waited_seconds // DAY_SECONDS)} days"

    @property
    def text(self) -> str:
        return f"Oldest waiting: task {self.task_id}, {self.age}"
