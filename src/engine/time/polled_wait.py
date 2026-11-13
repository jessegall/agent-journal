import time
from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class PolledWait:
    """Looks at a condition every pause until it holds or the limit has passed, and says whether it held."""

    limit_seconds: float
    pause_seconds: float

    def poll(self, condition: Callable[[], bool]) -> bool:
        deadline = time.monotonic() + self.limit_seconds
        while not condition():
            if time.monotonic() >= deadline:
                return False
            time.sleep(self.pause_seconds)
        return True
