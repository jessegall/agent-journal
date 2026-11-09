import threading
from collections import Counter
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from core.modules.plugins.support.plugin_late_error import PluginLateError

MOST_WAITING_CALLS = 32


class PluginServiceWaits:
    """Counts the calls waiting on each plugin service and refuses one past the limit, so a slow service
    cannot use up the server's threads and files."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.waiting: Counter[Path] = Counter()

    @contextmanager
    def locked(self, path: Path) -> Generator[None]:
        with self.lock:
            if self.waiting[path] >= MOST_WAITING_CALLS:
                raise PluginLateError(f"{MOST_WAITING_CALLS} calls already wait on its service")
            self.waiting[path] += 1
        try:
            yield
        finally:
            with self.lock:
                self.waiting[path] -= 1
