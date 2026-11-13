import os
from pathlib import Path

from engine.file.file_access import FileAccess

OWNER_FILE = "demo-owner.pid"


class DemoOwner:
    """The process a demo's server lives for: its pid is kept in the demo's journal folder, and the server
    stops once that process is gone."""

    def __init__(self, journal_folder: Path) -> None:
        self.file = journal_folder / OWNER_FILE

    def keep(self, pid: int) -> None:
        FileAccess.write(self.file, str(pid))

    def has_ended(self) -> bool:
        if not FileAccess.is_file(self.file):
            return False
        text = FileAccess.read(self.file).strip()
        if not text.isdigit():
            return False
        try:
            os.kill(int(text), 0)
        except ProcessLookupError:
            return True
        return False
