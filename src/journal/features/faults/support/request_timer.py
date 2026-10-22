import time
from dataclasses import dataclass


@dataclass(frozen=True)
class RequestTimer:
    """The clocks read when a request began: the wall clock and the CPU time of the thread that serves it."""

    wall_seconds: float
    cpu_seconds: float

    @classmethod
    def started(cls) -> "RequestTimer":
        return cls(time.perf_counter(), time.thread_time())

    def wall_ms(self) -> float:
        return (time.perf_counter() - self.wall_seconds) * 1000

    def cpu_ms(self) -> float:
        return (time.thread_time() - self.cpu_seconds) * 1000
