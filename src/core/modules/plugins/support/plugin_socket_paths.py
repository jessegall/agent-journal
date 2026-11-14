from pathlib import Path

from engine.journal.journal_home import JournalHome


class PluginSocketPaths:
    """Where a plugin's services listen: a short folder under /tmp named for this journal, since a Unix
    socket's path may hold only about a hundred characters, with one socket per service for its answers and
    one for its health, and the pid of each service, so a server started after a crash stops the one left
    running."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.plugin_socket_folder

    def answers(self, plugin_name: str, service: str) -> Path:
        return self.folder / f"{plugin_name}-{service}.sock"

    def pid(self, plugin_name: str, service: str) -> Path:
        return self.folder / f"{plugin_name}-{service}.pid"

    def health(self, plugin_name: str, service: str) -> Path:
        return self.folder / f"{plugin_name}-{service}.health.sock"
