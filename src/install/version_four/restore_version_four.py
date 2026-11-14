from engine.file.file_access import FileAccess
import shutil
from datetime import datetime, timezone
from pathlib import Path

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from engine.provider.hook_manager import HookManager
from engine.provider.managed_hooks import ManagedHooks
from install.update.code_replacement import CodeReplacement
from install.hook.hook_switch import HookSwitch
from install.version_four.upgrade_outcome import UpgradeOutcome
from install.backup.version_four_backup import DATABASE, VersionFourBackup
from install.version_four.version_four_files import CODE_FOLDER, READERS_FOLDER, SHELL_ENTRY, VersionFourFiles

INTEGRITY_PASS = "ok"
SIDE_FILES = ("-wal", "-shm")


class RestoreVersionFour:
    """Puts version 4 back: with the server stopped and its lock kept, moves the version 5 database aside as a
    dated file and puts the backup back as version 4's journal.db, with version 4's code beside it. It refuses
    when the backup is missing or fails sqlite's integrity check."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def run(self) -> UpgradeOutcome:
        backup = VersionFourBackup(self.home.folder).latest()
        if backup is None:
            return UpgradeOutcome(1, f"no backup of version 4 in {self.home.folder / 'version-4'}: nothing to restore")
        if Database.file_integrity(backup) != INTEGRITY_PASS:
            return UpgradeOutcome(1, f"the backup {backup} fails its integrity check: it is not restored")
        lines: list[str] = []
        CodeReplacement(self.home).run([lambda: self.restore(backup, lines)])
        return UpgradeOutcome(0, "\n".join(lines))

    def restore(self, backup: Path, lines: list[str]) -> None:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        moved_names = [f"{self.home.database.name}{suffix}" for suffix in ("", *SIDE_FILES) if FileAccess.exists(self.home.folder / f"{self.home.database.name}{suffix}")]
        for name in moved_names:
            FileAccess.move(self.home.folder / name, self.home.folder / name.replace("version-5", f"version-5.{stamp}", 1))
        FileAccess.copy(backup, self.home.folder / DATABASE)
        retired = VersionFourFiles(self.home.folder).retired / CODE_FOLDER
        if FileAccess.is_dir(retired) and not FileAccess.exists(self.home.folder / CODE_FOLDER):
            FileAccess.copytree(retired, self.home.folder / CODE_FOLDER)
        readers = VersionFourFiles(self.home.folder).retired / READERS_FOLDER
        if FileAccess.is_dir(readers) and not FileAccess.exists(self.home.folder / READERS_FOLDER):
            FileAccess.copytree(readers, self.home.folder / READERS_FOLDER)
        entry = VersionFourFiles(self.home.folder).retired / SHELL_ENTRY
        if FileAccess.is_file(entry):
            FileAccess.copy(entry, self.home.folder / SHELL_ENTRY)
        HookManager(self.home.project_folder, ManagedHooks(self.home)).restore()
        lines.extend([f"version 5's database moved aside as version-5.{stamp}.db", f"version 4's journal.db restored from {backup}",
                      *HookSwitch(self.home.folder.parent).restore()])
