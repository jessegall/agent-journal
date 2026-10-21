import subprocess
import threading
from pathlib import Path

from journal.config import Config

COPIES_LIMIT = 200
LARGEST = 1_000_000
GIT_SECONDS = 5


class FileCopies:
    """The last version the journal saw of each file the agent changed, so a change a shell command made can be told line by line: against the version kept, or the committed one when none is."""

    def __init__(self, config: Config) -> None:
        self.root = config.root
        self._copies: dict[str, str] = {}
        self._lock = threading.Lock()

    def last_text(self, path: str) -> str:
        with self._lock:
            if path in self._copies:
                return self._copies[path]
        return self.committed(path)

    def current_text(self, path: str) -> str | None:
        file = self.root / path
        if not file.is_file() or file.stat().st_size > LARGEST:
            return None
        return file.read_text(errors="replace")

    def store(self, path: str, text: str) -> None:
        with self._lock:
            self._copies.pop(path, None)
            self._copies[path] = text
            for oldest in list(self._copies)[:-COPIES_LIMIT]:
                del self._copies[oldest]

    def committed(self, path: str) -> str:
        try:
            shown = subprocess.run(["git", "show", f"HEAD:{path}"], cwd=self.root, capture_output=True, text=True, errors="replace", timeout=GIT_SECONDS)
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return shown.stdout if shown.returncode == 0 else ""
