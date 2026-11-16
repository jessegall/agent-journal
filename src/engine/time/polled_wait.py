import time
from collections.abc import Callable
from dataclasses import dataclass

from engine.execution.thread_turn_count import THREAD_TURN_COUNT


@dataclass(frozen=True)
class PolledWait:
    """Looks at a condition every pause until it holds or the limit has passed, and says whether it held; a
    condition that already holds needs no wait, so only a pause is refused inside a write turn."""

    limit_seconds: float
    pause_seconds: float

    def poll(self, condition: Callable[[], bool]) -> bool:
        deadline = time.monotonic() + self.limit_seconds
        while not condition():
            if time.monotonic() >= deadline:
                return False
            THREAD_TURN_COUNT.refuse_wait("a polled wait")
            time.sleep(self.pause_seconds)
        return True
