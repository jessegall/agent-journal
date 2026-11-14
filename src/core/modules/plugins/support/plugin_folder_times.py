from pathlib import Path

from engine.file.file_access import FileAccess


class PluginFolderTimes:
    """The change time each plugin's queue folder had at the last look, and whether that look left a card
    unclaimed, so a tick reads a folder again only when something in it changed. Kept across rounds on purpose:
    it is no RoundState and a round never resets it."""

    def __init__(self) -> None:
        self.times: dict[str, int] = {}
        self.unclaimed: set[str] = set()

    def has_news(self, plugin: str, folder: Path) -> bool:
        if not FileAccess.is_dir(folder):
            return False
        changed_at = FileAccess.stat(folder).st_mtime_ns
        if plugin in self.unclaimed or self.times.get(plugin) != changed_at:
            self.times[plugin] = changed_at
            return True
        return False

    def looked(self, plugin: str, left_unclaimed: bool) -> None:
        if left_unclaimed:
            self.unclaimed.add(plugin)
        else:
            self.unclaimed.discard(plugin)
