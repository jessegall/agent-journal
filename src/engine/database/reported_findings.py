import time
from collections.abc import Callable
from threading import Lock

from engine.database.repeated_finding import RepeatedFinding

REPEAT_AFTER_SECONDS = 3600


class ReportedFindings:
    """The findings already reported on a server, by key with the count and the time they were reported at. A
    finding is reported once however many requests and rows meet it, and again when its count changes or after
    an hour."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic) -> None:
        self.seconds = seconds
        self.keys: dict[str, tuple[int, float]] = {}
        self.lock = Lock()

    def unreported(self, findings: list[RepeatedFinding]) -> list[RepeatedFinding]:
        keyed_findings: dict[str, RepeatedFinding] = {}
        for finding in findings:
            keyed_findings.setdefault(finding.key, finding)
        now = self.seconds()
        with self.lock:
            unreported_findings = [finding for key, finding in keyed_findings.items() if self.is_new(key, finding.count, now)]
            self.keys.update({finding.key: (finding.count, now) for finding in unreported_findings})
        return unreported_findings

    def is_new(self, key: str, count: int, current_time: float) -> bool:
        if key not in self.keys:
            return True
        reported_count, reported_at = self.keys[key]
        return count != reported_count or current_time - reported_at >= REPEAT_AFTER_SECONDS
