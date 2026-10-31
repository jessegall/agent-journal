from pathlib import Path

REPORT = "upgrade-report.txt"
PREVIOUS = "upgrade-report.1.txt"


class UpgradeReportFile:
    """The report an upgrade leaves in .journal: the newest in upgrade-report.txt, with the one it replaced kept as
    upgrade-report.1.txt."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal

    def save(self, text: str) -> None:
        current = self.journal / REPORT
        if current.exists():
            current.replace(self.journal / PREVIOUS)
        current.write_text(text + "\n")
