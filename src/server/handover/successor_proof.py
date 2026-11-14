from engine.file.file_access import FileAccess
import shutil
import sqlite3
from pathlib import Path

from engine.time.clock import Clock
from engine.database.database import Database
from engine.module.journal_container import opened_container, sync_modules
from engine.journal.journal_home import JournalHome
from engine.module.module_sync import ModuleSync
from server.tick.server_backup import ServerBackup

PLUGINS_FOLDER = "plugins"


class SuccessorProof:
    """Proves new code before the old server lets go of anything: its modules, the listed ones included, sync
    on an empty database, and on a copy of the real database when its migrations have not run there, after a
    database copy kept in the backup folder for going back. A failure raises, so the new server exits and the
    old one keeps serving."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def run(self) -> None:
        with FileAccess.temporary_folder() as folder:
            sync_modules(self.with_listed_modules(JournalHome(Path(folder))))
        if self.has_pending_migrations():
            ServerBackup(self.home, Clock()).write_copy()
            with FileAccess.temporary_folder(folder=self.home.folder) as folder:
                sync_modules(self.copied_home(Path(folder)))

    def has_pending_migrations(self) -> bool:
        container = opened_container(self.home)
        try:
            return container.get(ModuleSync).has_pending_migrations()
        finally:
            container.get(Database).close()

    def copied_home(self, folder: Path) -> JournalHome:
        copy = JournalHome(folder)
        source, target = sqlite3.connect(self.home.database), sqlite3.connect(copy.database)
        try:
            source.backup(target)
        finally:
            target.close()
            source.close()
        if FileAccess.is_dir(self.home.folder / PLUGINS_FOLDER):
            FileAccess.symlink_to(folder / PLUGINS_FOLDER, self.home.folder / PLUGINS_FOLDER, target_is_directory=True)
        return self.with_listed_modules(copy)

    def with_listed_modules(self, copy: JournalHome) -> JournalHome:
        if FileAccess.exists(self.home.module_list):
            FileAccess.copyfile(self.home.module_list, copy.module_list)
        if FileAccess.is_dir(self.home.modules_folder):
            FileAccess.symlink_to(copy.modules_folder, self.home.modules_folder, target_is_directory=True)
        return copy
