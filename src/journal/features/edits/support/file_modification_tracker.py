import os
import subprocess
import threading

from journal.config import Config
from journal.support.part import VENDOR_FOLDERS


class FileModificationTracker:
    """Tracks the modification timestamp of every project file git sees as changed from a script's start, so the files the script changed are the ones that became changed or whose timestamp moved; a project outside git has every file walked."""

    def __init__(self, config: Config) -> None:
        self.root = str(config.root)
        self.in_git = subprocess.run(["git", "rev-parse", "--is-inside-work-tree"], cwd=self.root, capture_output=True, timeout=10).returncode == 0
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
        paths = self.changed_paths() if self.in_git else self.walked_paths()
        return {path: os.stat(path).st_mtime_ns if os.path.isfile(path) else 0 for path in paths}

    def changed_paths(self) -> list[str]:
        entries = iter(subprocess.run(["git", "status", "--porcelain", "-uall", "-z"], cwd=self.root, capture_output=True, text=True, timeout=10).stdout.split("\0"))
        paths = []
        for entry in entries:
            if len(entry) > 3:
                paths.append(os.path.join(self.root, entry[3:]))
            if entry[:1] in ("R", "C"):
                next(entries, "")
        return paths

    def walked_paths(self) -> list[str]:
        paths = []
        for folder, names, files in os.walk(self.root):
            names[:] = [name for name in names if name not in VENDOR_FOLDERS]
            paths.extend(os.path.join(folder, name) for name in files)
        return paths
