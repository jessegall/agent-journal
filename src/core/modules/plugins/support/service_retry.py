from dataclasses import dataclass
from datetime import datetime, timedelta

FIRST_PAUSE = timedelta(seconds=30)
IMMEDIATE_FAILURES = 1
LONGEST_PAUSE = timedelta(minutes=10)


@dataclass
class ServiceRetry:
    """How often a service record_failure in a row, when it may be tried again, and whether the user was told."""

    failures: int = 0
    started_at: datetime | None = None
    retry_at: datetime | None = None
    is_reported: bool = False

    def pause(self) -> timedelta:
        if self.failures <= IMMEDIATE_FAILURES:
            return timedelta()
        return min(FIRST_PAUSE * 2 ** (self.failures - IMMEDIATE_FAILURES - 1), LONGEST_PAUSE)
