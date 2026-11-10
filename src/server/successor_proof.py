import shutil
import sqlite3
import tempfile
from pathlib import Path

from engine.time.clock import Clock
from core.base.database.database import Database
from engine.container.journal_container import opened_container, sync_modules
from engine.journal.journal_home import JournalHome
from core.base.module.module_sync import ModuleSync
from server.server_backup import ServerBackup

PLUGINS_FOLDER = "plugins"


class SuccessorProof:
    """Proves new code before the old server lets go of anything: its modules, the listed ones included, sync
    on an empty database, and on a copy of the real database when its migrations have not run there, after a
    database copy kept in the backup folder for going back. A failure raises, so the new server exits and the
    old one keeps serving."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def run(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            sync_modules(self.with_listed_modules(JournalHome(Path(folder))))
        if self.has_pending_migrations():
            ServerBackup(self.home, Clock()).write_copy()
            with tempfile.TemporaryDirectory(dir=self.home.folder) as folder:
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
        if (self.home.folder / PLUGINS_FOLDER).is_dir():
            (folder / PLUGINS_FOLDER).symlink_to(self.home.folder / PLUGINS_FOLDER, target_is_directory=True)
        return self.with_listed_modules(copy)

    def with_listed_modules(self, copy: JournalHome) -> JournalHome:
        if self.home.module_list.exists():
            shutil.copyfile(self.home.module_list, copy.module_list)
        if self.home.modules_folder.is_dir():
            copy.modules_folder.symlink_to(self.home.modules_folder, target_is_directory=True)
        return copy
