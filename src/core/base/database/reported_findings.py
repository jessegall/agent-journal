from threading import Lock

from core.base.database.repeated_finding import RepeatedFinding


class ReportedFindings:
    """The keys of the findings already reported on a server, so a finding is reported once however many
    requests and rows meet it."""

    def __init__(self) -> None:
        self.keys: set[str] = set()
        self.lock = Lock()

    def unreported(self, findings: list[RepeatedFinding]) -> list[RepeatedFinding]:
        keyed_findings: dict[str, RepeatedFinding] = {}
        for finding in findings:
            keyed_findings.setdefault(finding.key, finding)
        with self.lock:
            unreported_findings = [finding for key, finding in keyed_findings.items() if key not in self.keys]
            self.keys.update(finding.key for finding in unreported_findings)
        return unreported_findings
