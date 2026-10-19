import threading
import time


class RecentCounts:
    """How often something came from a key in the last stretch of time, so a visitor cannot repeat it without limit; a subclass names how many and how long."""

    MOST = 0
    WITHIN = 0

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.tries: dict[str, list[float]] = {}

    def recent(self, key: str) -> list[float]:
        since = time.time() - self.WITHIN
        return [at for at in self.tries.get(key, []) if at > since]

    def locked(self, key: str) -> bool:
        with self.lock:
            return len(self.recent(key)) >= self.MOST

    def count(self, key: str) -> None:
        with self.lock:
            self.tries[key] = [*self.recent(key), time.time()]
