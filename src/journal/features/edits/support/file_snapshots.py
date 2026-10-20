import subprocess
import threading
from pathlib import Path

from journal.config import Config

KEPT = 200
"""How many files' last versions are kept, the ones changed last."""
LARGEST = 1_000_000
"""The largest file, in bytes, whose versions are kept and compared; a larger one's change is counted, not drawn."""
GIT_SECONDS = 5


class FileSnapshots:
    """The last version the journal saw of each file the agent changed, so a change a shell command made can be told line by line: against the version kept, or the committed one when none is."""

    def __init__(self, config: Config) -> None:
        self.root = config.root
        self._kept: dict[str, str] = {}
        self._lock = threading.Lock()

    def before(self, path: str) -> str:
        with self._lock:
            if path in self._kept:
                return self._kept[path]
        return self.committed(path)

    def now(self, path: str) -> str | None:
        """The file as it is, or none when it is gone or too large to compare."""
        file = self.root / path
        if not file.is_file() or file.stat().st_size > LARGEST:
            return None
        return file.read_text(errors="replace")

    def keep(self, path: str, text: str) -> None:
        with self._lock:
            self._kept.pop(path, None)
            self._kept[path] = text
            for stale in list(self._kept)[:-KEPT]:
                del self._kept[stale]

    def committed(self, path: str) -> str:
        """The file as the last commit has it; empty for a file git does not know."""
        try:
            shown = subprocess.run(["git", "show", f"HEAD:{path}"], cwd=self.root, capture_output=True, text=True, errors="replace", timeout=GIT_SECONDS)
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return shown.stdout if shown.returncode == 0 else ""
