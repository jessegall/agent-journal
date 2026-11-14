from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass(frozen=True)
class FullRunRecord:
    """One run of the whole suite: how many tests it ran, how many failed, how long it took on the clock and
    how many processor seconds the test runners spent together, kept as a line in the checkout's journal
    folder so a check can warn when the time per test grows. A line from before the processor seconds were
    kept reads with none."""

    tests: int
    failed: int
    seconds: float
    cpu_seconds: float = 0.0
    finished_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @property
    def average_test_seconds(self) -> float:
        return self.seconds / max(self.tests, 1)

    def summary_line(self) -> str:
        return f"full run: {self.seconds:.1f} wall seconds, {self.cpu_seconds:.1f} cpu seconds in the test runners"
