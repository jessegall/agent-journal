from pathlib import Path

from engine.file.file_access import FileAccess

REPORT = "upgrade-report.txt"
PREVIOUS = "upgrade-report.1.txt"


class UpgradeReportFile:
    """The report an upgrade leaves in .journal: the newest in upgrade-report.txt, with the one it replaced
    kept as upgrade-report.1.txt."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal

    def save(self, text: str) -> None:
        current = self.journal / REPORT
        if FileAccess.exists(current):
            FileAccess.replace(current, self.journal / PREVIOUS)
        FileAccess.write(current, text + "\n")
