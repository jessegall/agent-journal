import os
import threading

from journal.config import Config
from journal.support.part import VENDOR_FOLDERS


class FileModificationTracker:
    """Tracks the modification timestamp of every project file from a script's start, so the files it changed are the ones whose timestamp moved."""

    def __init__(self, config: Config) -> None:
        self.root = str(config.root)
        self._start_modified_at: dict[int, dict[str, int]] = {}
        self._lock = threading.Lock()

    def record(self, tool_use: int) -> None:
        modified_at = self.current_timestamps()
        with self._lock:
            self._start_modified_at[tool_use] = modified_at

    def moved(self, tool_use: int) -> list[str]:
        with self._lock:
            started_at = self._start_modified_at.pop(tool_use, None)
        if started_at is None:
            return []
        return [path for path, modified in self.current_timestamps().items() if started_at.get(path) != modified]

    def current_timestamps(self) -> dict[str, int]:
        modified_at: dict[str, int] = {}
        for folder, names, files in os.walk(self.root):
            names[:] = [name for name in names if name not in VENDOR_FOLDERS]
            for name in files:
                path = os.path.join(folder, name)
                modified_at[path] = os.stat(path).st_mtime_ns if os.path.isfile(path) else 0
        return modified_at
