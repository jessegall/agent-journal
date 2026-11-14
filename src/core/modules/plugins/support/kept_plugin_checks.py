import threading
from collections.abc import Callable
from functools import cache
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_run_check import PluginRunCheck

KEPT_PLUGIN_COUNT = 100
Signature = tuple[int, str, bool, int, int]


class KeptPluginChecks:
    """Whether each plugin may run, kept across hooks while nothing it was decided from changed: the plugin's row,
    its upgrade, and the newest change time and the count of its code files, which a look at each file's time gives
    without reading the files. A notice that a plugin's files changed is never kept, since it is recorded once."""

    def __init__(self) -> None:
        self.kept: dict[int, tuple[Signature, PluginRunCheck]] = {}
        self.lock = threading.Lock()

    # one record for each journal a process serves, shared by every hook and round
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "KeptPluginChecks":
        return KeptPluginChecks()

    def check(self, plugin: Plugin, code: Path, is_upgrading: bool, checked: Callable[[], PluginRunCheck]) -> PluginRunCheck:
        signature = (plugin.version, plugin.files_digest, is_upgrading, *self.code_times(code))
        with self.lock:
            kept = self.kept.get(plugin.id)
        if kept is not None and kept[0] == signature:
            return kept[1]
        result = checked()
        with self.lock:
            if result.is_changed:
                self.kept.pop(plugin.id, None)
            else:
                if len(self.kept) >= KEPT_PLUGIN_COUNT:
                    self.kept.clear()
                self.kept[plugin.id] = (signature, result)
        return result

    @staticmethod
    def code_times(code: Path) -> tuple[int, int]:
        if not FileAccess.is_dir(code):
            return 0, 0
        times = [FileAccess.stat(path).st_mtime_ns for path in FileAccess.walk(code)]
        return max(times, default=0), len(times)
