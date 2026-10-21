import os
import threading

from journal.config import Config
from journal.features.shell.support.part import VENDOR_FOLDERS


class FileTimes:
    """The modification time of every project file as a script's tool use began, so the files it changed are the ones whose time moved."""

    def __init__(self, config: Config) -> None:
        self.root = str(config.root)
        self._snapshots: dict[int, dict[str, int]] = {}
        self._lock = threading.Lock()

    def snapshot(self, tool_use: int) -> None:
        taken = self.times()
        with self._lock:
            self._snapshots[tool_use] = taken

    def moved(self, tool_use: int) -> list[str]:
        with self._lock:
            before = self._snapshots.pop(tool_use, None)
        if before is None:
            return []
        return [path for path, time in self.times().items() if before.get(path) != time]

    def times(self) -> dict[str, int]:
        times: dict[str, int] = {}
        for folder, names, files in os.walk(self.root):
            names[:] = [name for name in names if name not in VENDOR_FOLDERS]
            for name in files:
                path = os.path.join(folder, name)
                times[path] = os.stat(path).st_mtime_ns if os.path.isfile(path) else 0
        return times
