import threading
from collections.abc import Callable
from functools import cache
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_manifest_files import PluginManifestFiles
from core.modules.plugins.support.plugin_run_check import PluginRunCheck

KEPT_PLUGIN_COUNT = 100
Signature = tuple[int, str, bool, tuple[tuple[str, int, int], ...]]


class KeptPluginChecks:
    """Whether each plugin may run, kept across hooks while nothing it was decided from changed: the plugin's row,
    its upgrade, and the size and change time of the files its manifest names, the same files its digest covers,
    so a hook looks at a few files' metadata and never walks the plugin's folder. A notice that a plugin's files changed is never kept, since it is recorded once."""

    def __init__(self) -> None:
        self.kept: dict[int, tuple[Signature, PluginRunCheck]] = {}
        self.lock = threading.Lock()

    # one record for each journal a process serves, shared by every hook and round
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "KeptPluginChecks":
        return KeptPluginChecks()

    def check(self, plugin: Plugin, code: Path, is_upgrading: bool, checked: Callable[[], PluginRunCheck]) -> PluginRunCheck:
        with self.lock:
            kept = self.kept.get(plugin.id)
        if kept is not None and kept[0] == self.signature(plugin, code, is_upgrading, kept[1]):
            return kept[1]
        result = checked()
        signature = self.signature(plugin, code, is_upgrading, result)
        with self.lock:
            if result.is_changed:
                self.kept.pop(plugin.id, None)
            else:
                if len(self.kept) >= KEPT_PLUGIN_COUNT:
                    self.kept.clear()
                self.kept[plugin.id] = (signature, result)
        return result

    @staticmethod
    def signature(plugin: Plugin, code: Path, is_upgrading: bool, result: PluginRunCheck) -> Signature:
        stats = tuple((name, stat.st_size, stat.st_mtime_ns) for name in KeptPluginChecks.watched_files(code, result) if FileAccess.exists(code / name) for stat in [FileAccess.stat(code / name)])
        return plugin.version, plugin.files_digest, is_upgrading, stats

    # a plugin that cannot run yet has no manifest read, so its manifests alone are watched
    @staticmethod
    def watched_files(code: Path, result: PluginRunCheck) -> tuple[str, ...]:
        if result.runnable is not None:
            return result.runnable.manifest.files
        if not FileAccess.is_dir(code):
            return ()
        return PluginManifestFiles.listed(code).names
