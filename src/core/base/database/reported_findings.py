from threading import Lock

from core.base.database.repeated_finding import RepeatedFinding


class ReportedFindings:
    """The keys of the findings already reported on a server, so a finding is reported once however many
    requests and rows meet it."""

    def __init__(self) -> None:
        self.keys: set[str] = set()
        self.lock = Lock()

    def unreported(self, findings: list[RepeatedFinding]) -> list[RepeatedFinding]:
        first_of_key: dict[str, RepeatedFinding] = {}
        for finding in findings:
            first_of_key.setdefault(finding.key, finding)
        with self.lock:
            new_findings = [finding for key, finding in first_of_key.items() if key not in self.keys]
            self.keys.update(finding.key for finding in new_findings)
        return new_findings
