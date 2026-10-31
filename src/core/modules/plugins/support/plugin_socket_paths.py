import hashlib
from pathlib import Path

from core.base.journal_home import JournalHome

SOCKET_ROOT = Path("/tmp")


class PluginSocketPaths:
    """Where a plugin's services listen: a short folder under /tmp named for this journal, since a Unix socket's
    path may hold only about a hundred characters, with one socket per service for its answers and one for its
    health."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = SOCKET_ROOT / f"journal-{hashlib.sha256(str(home.folder.resolve()).encode()).hexdigest()[:12]}"

    def answers(self, plugin_name: str, service: str) -> Path:
        return self.folder / f"{plugin_name}-{service}.sock"

    def health(self, plugin_name: str, service: str) -> Path:
        return self.folder / f"{plugin_name}-{service}.health.sock"
