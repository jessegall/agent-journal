from dataclasses import dataclass, field
from datetime import datetime, timedelta

FIRST_PAUSE = timedelta(seconds=30)
LONGEST_PAUSE = timedelta(minutes=10)
STEADY_RUN = timedelta(minutes=5)
TOLD_AFTER_FAILURES = 3
IMMEDIATE_FAILURES = 1


@dataclass
class ServiceRetry:
    """How often a service failed in a row, when it may be tried again, and whether the user was told."""

    failures: int = 0
    started_at: datetime | None = None
    retry_at: datetime | None = None
    is_told: bool = False

    def pause(self) -> timedelta:
        if self.failures <= IMMEDIATE_FAILURES:
            return timedelta()
        return min(FIRST_PAUSE * 2 ** (self.failures - IMMEDIATE_FAILURES - 1), LONGEST_PAUSE)


@dataclass
class ServiceRetries:
    """The services that failed to run, by plugin and service name: each is tried again at once after its first
    failure, then after a pause that doubles up to ten minutes; one that failed three times in a row is
    named once to the user, and one that ran for five minutes starts over."""

    retries: dict[tuple[str, str], ServiceRetry] = field(default_factory=dict)

    def is_due(self, key: tuple[str, str], now: datetime) -> bool:
        retry = self.retries.get(key)
        return retry is None or retry.retry_at is None or now >= retry.retry_at

    def started(self, key: tuple[str, str], now: datetime) -> None:
        self.retries.setdefault(key, ServiceRetry()).started_at = now

    def steady(self, key: tuple[str, str], now: datetime) -> None:
        retry = self.retries.get(key)
        if retry is not None and retry.started_at is not None and now - retry.started_at >= STEADY_RUN:
            del self.retries[key]

    def failed(self, key: tuple[str, str], now: datetime) -> bool:
        """Records a failure and says whether the user must be told of it now."""
        retry = self.retries.setdefault(key, ServiceRetry())
        retry.failures += 1
        retry.started_at = None
        retry.retry_at = now + retry.pause()
        must_tell = retry.failures >= TOLD_AFTER_FAILURES and not retry.is_told
        retry.is_told = retry.is_told or must_tell
        return must_tell
