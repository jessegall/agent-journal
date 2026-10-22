import threading
import time as timing


class RecentCounts:
    """How often something came from a key in the last stretch of time, so a visitor cannot repeat it without limit; a subclass names how many and how long."""

    MAXIMUM_COUNT = 0
    WINDOW_SECONDS = 0

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.tries: dict[str, list[float]] = {}

    def recent(self, key: str) -> list[float]:
        start = timing.time() - self.WINDOW_SECONDS
        return [time for time in self.tries.get(key, []) if time > start]

    def locked(self, key: str) -> bool:
        with self.lock:
            return len(self.recent(key)) >= self.MAXIMUM_COUNT

    def count(self, key: str) -> None:
        with self.lock:
            self.tries[key] = [*self.recent(key), timing.time()]
