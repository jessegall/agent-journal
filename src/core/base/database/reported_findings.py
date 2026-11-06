from threading import Lock


class ReportedFindings:
    """The texts of the findings already reported on a server, so a text is reported once however many
    requests meet it."""

    def __init__(self) -> None:
        self.texts: set[str] = set()
        self.lock = Lock()

    def unreported(self, findings: list[str]) -> list[str]:
        with self.lock:
            new_findings = [finding for finding in dict.fromkeys(findings) if finding not in self.texts]
            self.texts.update(new_findings)
        return new_findings
