import sqlite3
import time
from datetime import datetime
from pathlib import Path

from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.support.settings_tree import BACKUP_COUNT_SETTING, BACKUP_MINUTES_SETTING

BACKUP_FOLDER = "backups-watch"
COPY_PREFIX = "version-5-"
SECONDS_PER_MINUTE = 60


class ServerBackup:
    """Writes an online copy of the journal's database once the minutes a setting names have passed since the
    newest copy, and keeps the newest copies a setting counts; 0 minutes writes none."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def follow(self) -> None:
        container = synced_container(self.home)
        try:
            settings = container.get(SettingValues)
            minutes, count = settings.number(BACKUP_MINUTES_SETTING, None), settings.number(BACKUP_COUNT_SETTING, None)
        finally:
            container.get(Database).close()
        copies = self.copies()
        if minutes == 0 or (copies and time.time() - copies[0].stat().st_mtime < minutes * SECONDS_PER_MINUTE):
            return
        self.write_copy()
        for extra_copy in self.copies()[count:]:
            extra_copy.unlink()

    def folder(self) -> Path:
        return self.home.folder / BACKUP_FOLDER

    def copies(self) -> list[Path]:
        return sorted(self.folder().glob(f"{COPY_PREFIX}*.db"), reverse=True)

    def write_copy(self) -> None:
        self.folder().mkdir(parents=True, exist_ok=True)
        target = self.folder() / f"{COPY_PREFIX}{datetime.now().strftime('%Y%m%d-%H%M%S')}.db"
        source = sqlite3.connect(self.home.database)
        copy = sqlite3.connect(target)
        try:
            source.backup(copy)
        finally:
            copy.close()
            source.close()
