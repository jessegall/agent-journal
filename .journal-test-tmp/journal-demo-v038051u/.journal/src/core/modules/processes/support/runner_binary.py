from pathlib import Path

from core.base.journal_home import JournalHome

RUNNER = "journal-run"


class RunnerBinary:
    """The runner the installer places in .journal/bin: where it is and whether it is there."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def path(self) -> Path:
        return self.home.folder.resolve() / "bin" / RUNNER

    def is_installed(self) -> bool:
        return self.path.is_file()
