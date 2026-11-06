from core.base.file_access import FileAccess
import os
import shutil
import signal
import tempfile
import time
from collections.abc import Sequence
from pathlib import Path

DEMO_LIFE_SECONDS = 24 * 3600
START_SECONDS = 600
SCRATCH_ROOT = "/tmp"


class DemoFolders:
    """The scratch folders demos leave in the temp folders: a demo older than a day is stopped, and a folder
    whose demo no longer runs is removed, whether it ended or crashed. A folder too recent to have a server
    yet stays."""

    def __init__(self, roots: Sequence[Path] = (Path(tempfile.gettempdir()), Path(SCRATCH_ROOT))) -> None:
        self.roots = roots

    def prune(self) -> int:
        removed = 0
        for folder in (folder for root in self.roots for folder in root.glob("journal-demo-*")):
            age_seconds = time.time() - folder.stat().st_mtime
            pid = self.running_pid(folder)
            if pid is not None and age_seconds > DEMO_LIFE_SECONDS:
                os.kill(pid, signal.SIGTERM)
            if pid is None and age_seconds > START_SECONDS:
                shutil.rmtree(folder, ignore_errors=True)
                removed += 1
        return removed

    def running_pid(self, folder: Path) -> int | None:
        pid_file = folder / ".journal" / "server.pid"
        text = FileAccess.shared().read(pid_file).strip() if pid_file.is_file() else ""
        if not text.isdigit():
            return None
        try:
            os.kill(int(text), 0)
        except ProcessLookupError:
            return None
        return int(text)
