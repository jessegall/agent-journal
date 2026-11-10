import sqlite3
from pathlib import Path

from engine.time.clock import Clock
from engine.database.database import Database
from engine.container.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.setting.setting_values import SettingValues
from core.modules.settings.support.settings_tree import BACKUP_COUNT_SETTING, BACKUP_MINUTES_SETTING
from engine.time.timestamp import MINUTE_SECONDS

BACKUP_FOLDER = "backups-watch"
COPY_PREFIX = "version-5-"
PARTIAL_SUFFIX = ".partial"
LEAST_COPIES = 1


class ServerBackup:
    """Writes an online copy of the journal's database once the minutes a setting names have passed since the
    newest copy, under a name of its own until it is whole, and keeps the newest copies a setting counts, at
    least the one
    just written; 0 minutes writes none."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock

    def follow(self) -> None:
        container = synced_container(self.home)
        try:
            settings = container.get(SettingValues)
            minutes, count = settings.project.number(BACKUP_MINUTES_SETTING), settings.project.number(BACKUP_COUNT_SETTING)
        finally:
            container.get(Database).close()
        copies = self.copies()
        if minutes == 0 or (copies and self.clock.epoch_seconds() - copies[0].stat().st_mtime < minutes * MINUTE_SECONDS):
            return
        self.write_copy()
        for extra_copy in self.copies()[max(count, LEAST_COPIES):]:
            extra_copy.unlink()

    def folder(self) -> Path:
        return self.home.folder / BACKUP_FOLDER

    def copies(self) -> list[Path]:
        return sorted(self.folder().glob(f"{COPY_PREFIX}*.db"), reverse=True)

    def write_copy(self) -> None:
        self.folder().mkdir(parents=True, exist_ok=True)
        target = self.folder() / f"{COPY_PREFIX}{self.clock.timestamp().value.strftime('%Y%m%d-%H%M%S')}.db"
        partial = target.with_suffix(PARTIAL_SUFFIX)
        source = sqlite3.connect(self.home.database)
        copy = sqlite3.connect(partial)
        try:
            source.backup(copy)
            copy.close()
            partial.replace(target)
        finally:
            copy.close()
            source.close()
            partial.unlink(missing_ok=True)
