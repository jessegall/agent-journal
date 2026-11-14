from engine.database.write_turns import WriteTurns
from engine.file.file_access import FileAccess
import sqlite3
from pathlib import Path

from engine.time.clock import Clock
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.setting.setting_values import SettingValues
from core.modules.settings.support.settings_tree import BACKUP_COUNT_SETTING, BACKUP_MINUTES_SETTING
from engine.time.timestamp import MINUTE_SECONDS

BACKUP_FOLDER = "backups-watch"
COPY_PREFIX = "version-5-"
PARTIAL_SUFFIX = ".partial"
LEAST_COPIES = 1


class ServerBackup:
    """Writes an online copy of the journal's database, before an update and every so many minutes when a setting
    asks for it (0, the default, never), under a name of its own until it is whole; each check keeps only the
    newest copies a setting counts, at least one, and a write removes a partial copy a failed write left."""

    def __init__(self, home: JournalHome, clock: Clock, turns: WriteTurns | None = None) -> None:
        self.home, self.clock, self.turns = home, clock, turns

    def follow(self) -> None:
        container = synced_container(self.home, self.turns)
        try:
            settings = container.get(SettingValues)
            minutes, count = settings.project.number(BACKUP_MINUTES_SETTING), settings.project.number(BACKUP_COUNT_SETTING)
        finally:
            container.get(Database).close()
        if minutes > 0 and not self.has_recent_copy(minutes):
            self.write_copy()
        for extra_copy in self.copies()[max(count, LEAST_COPIES):]:
            FileAccess.unlink(extra_copy)

    def folder(self) -> Path:
        return self.home.folder / BACKUP_FOLDER

    def has_recent_copy(self, minutes: int) -> bool:
        copies = self.copies()
        return bool(copies) and self.clock.epoch_seconds() - FileAccess.stat(copies[0]).st_mtime < minutes * MINUTE_SECONDS

    def copies(self) -> list[Path]:
        return sorted(FileAccess.glob(self.folder(), f"{COPY_PREFIX}*.db"), reverse=True)

    def write_copy(self) -> None:
        FileAccess.mkdir(self.folder(), parents=True, exist_ok=True)
        for leftover in FileAccess.glob(self.folder(), f"{COPY_PREFIX}*{PARTIAL_SUFFIX}*"):
            FileAccess.unlink(leftover)
        target = self.folder() / f"{COPY_PREFIX}{self.clock.timestamp().value.strftime('%Y%m%d-%H%M%S')}.db"
        partial = target.with_suffix(PARTIAL_SUFFIX)
        source = sqlite3.connect(self.home.database)
        copy = sqlite3.connect(partial)
        try:
            source.backup(copy)
            copy.close()
            FileAccess.replace(partial, target)
        finally:
            copy.close()
            source.close()
            FileAccess.unlink(partial, missing_ok=True)
