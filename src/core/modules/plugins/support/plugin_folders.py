from pathlib import Path

from core.base.clock import Clock
from core.base.journal_home import JournalHome

UPGRADE_MARK_SUFFIX = ".upgrading"
UPGRADE_MARK_SECONDS = 300


class PluginFolders:
    """Where an installed plugin's code and its kept data live in the journal's folder."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock

    def code(self, name: str) -> Path:
        return self.home.folder / "plugins" / name

    def upgrade_mark(self, name: str) -> Path:
        return self.code(name).with_name(name + UPGRADE_MARK_SUFFIX)

    def is_upgrading(self, name: str) -> bool:
        mark = self.upgrade_mark(name)
        return mark.exists() and self.clock.epoch_seconds() - mark.stat().st_mtime < UPGRADE_MARK_SECONDS

    def service_log(self, name: str, service: str) -> Path:
        return self.data(name) / f"service-{service}.log"

    def data(self, name: str) -> Path:
        return self.home.folder / "plugin-data" / name
