from dataclasses import dataclass, field
from datetime import datetime, timedelta

FIRST_PAUSE = timedelta(seconds=30)
LONGEST_PAUSE = timedelta(minutes=10)
STEADY_RUN = timedelta(minutes=5)
REPORTED_AFTER_FAILURES = 3
IMMEDIATE_FAILURES = 1


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


@dataclass
class ServiceRetries:
    """The services that record_failure to run, by plugin and service name: each is tried again at once after its first
    failure, then after a pause that doubles up to ten minutes; one that failed three times in a row is
    named once to the user, and one that ran for five minutes starts over."""

    retries: dict[tuple[str, str], ServiceRetry] = field(default_factory=dict[tuple[str, str], ServiceRetry])

    def may_retry(self, key: tuple[str, str], current_time: datetime) -> bool:
        retry = self.retries.get(key)
        return retry is None or retry.retry_at is None or current_time >= retry.retry_at

    def record_start(self, key: tuple[str, str], current_time: datetime) -> None:
        self.retries.setdefault(key, ServiceRetry()).started_at = current_time

    def forget_steady(self, key: tuple[str, str], current_time: datetime) -> None:
        retry = self.retries.get(key)
        if retry is not None and retry.started_at is not None and current_time - retry.started_at >= STEADY_RUN:
            del self.retries[key]

    def record_failure(self, key: tuple[str, str], current_time: datetime) -> bool:
        retry = self.retries.setdefault(key, ServiceRetry())
        retry.failures += 1
        retry.started_at = None
        retry.retry_at = current_time + retry.pause()
        must_report = retry.failures >= REPORTED_AFTER_FAILURES and not retry.is_reported
        retry.is_reported = retry.is_reported or must_report
        return must_report
