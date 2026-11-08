from functools import cache

from core.base.child_process import ChildProcess
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
from core.base.leftover_process import STOP_LIMIT_SECONDS
from core.modules.plugins.support.plugin_place import PluginPlace, PluginPlaceRows


class ServiceProcesses:
    """The plugin services this journal started, by plugin and service name, the digest of the plugin's files each
    was started with, its place in the process queue, ended through the rows of whoever stops it since this set
    outlives the round that started it, and when the condition of each one that did not start was
    checked. The journal's server holds one set for its home, which a command that changes a plugin's files may start services into
    once the server has said it keeps them."""

    def __init__(self) -> None:
        self.serving = False
        self.running: dict[tuple[str, str], ChildProcess] = {}
        self.digests: dict[tuple[str, str], str] = {}
        self.places: dict[tuple[str, str], PluginPlace] = {}
        self.skipped: dict[tuple[str, str], Timestamp] = {}

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "ServiceProcesses":
        return cls()

    def stop(self, key: tuple[str, str], rows: PluginPlaceRows | None = None) -> None:
        process = self.running.pop(key)
        process.stop_group(STOP_LIMIT_SECONDS)
        self.leave(key, process.exit_code() or 0, rows)

    def leave(self, key: tuple[str, str], exit_code: int, rows: PluginPlaceRows | None = None) -> None:
        if key not in self.places:
            return
        place = self.places.pop(key)
        (place if rows is None else place.through(rows)).leave(exit_code)

    def close(self, rows: PluginPlaceRows | None = None) -> None:
        for key in list(self.running):
            self.stop(key, rows)
