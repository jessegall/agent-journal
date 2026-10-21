import threading

from journal.models.timing import Timing
from journal.repositories.statistics import Statistics
from journal.repositories.timings import Timings
from journal.support.actor import Actor


class DeveloperTally:
    """The developer numbers of the requests answered since they were last written, held in memory and written together: the sums to add to each series, the slowest time of each, and the timings."""

    def __init__(self, statistics: Statistics, timings: Timings) -> None:
        self.statistics, self.timings = statistics, timings
        self._lock = threading.Lock()
        self._sums: dict[str, int] = {}
        self._slowest: dict[str, int] = {}
        self._timings: list[Timing] = []

    def measured(self, prefix: str, ms: int) -> None:
        with self._lock:
            self._sums[f"{prefix}.count"] = self._sums.get(f"{prefix}.count", 0) + 1
            self._sums[f"{prefix}.total_ms"] = self._sums.get(f"{prefix}.total_ms", 0) + ms
            self._slowest[f"{prefix}.slowest_ms"] = max(ms, self._slowest.get(f"{prefix}.slowest_ms", 0))

    def added(self, key: str, amount: int) -> None:
        with self._lock:
            self._sums[key] = self._sums.get(key, 0) + amount

    def logged(self, timing: Timing) -> None:
        with self._lock:
            self._timings.append(timing)

    def write(self) -> None:
        with self._lock:
            sums, slowest, timings = self._sums, self._slowest, self._timings
            self._sums, self._slowest, self._timings = {}, {}, []
        for key, amount in sums.items():
            self.statistics.added(key, amount, Actor.system())
        for key, ms in slowest.items():
            self.statistics.raised(key, ms, Actor.system())
        for timing in timings:
            self.timings.logged(timing, Actor.system())
