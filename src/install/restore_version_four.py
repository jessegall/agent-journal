import shutil
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from core.base.journal_home import JournalHome
from install.code_replacement import CodeReplacement
from install.upgrade_outcome import UpgradeOutcome
from install.version_four_backup import DATABASE, VersionFourBackup
from install.version_four_files import CODE_FOLDER, VersionFourFiles

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
        if self.integrity(backup) != INTEGRITY_PASS:
            return UpgradeOutcome(1, f"the backup {backup} fails its integrity check: it is not restored")
        lines: list[str] = []
        CodeReplacement(self.home).run([lambda: self.restore(backup, lines)])
        return UpgradeOutcome(0, "\n".join(lines))

    def integrity(self, backup: Path) -> str:
        connection = sqlite3.connect(f"{backup.resolve().as_uri()}?mode=ro", uri=True)
        try:
            return str(connection.execute("PRAGMA integrity_check").fetchone()[0])
        except sqlite3.DatabaseError as error:
            return str(error)
        finally:
            connection.close()

    def restore(self, backup: Path, lines: list[str]) -> None:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        displaced = [f"{self.home.database.name}{suffix}" for suffix in ("", *SIDE_FILES) if (self.home.folder / f"{self.home.database.name}{suffix}").exists()]
        for name in displaced:
            shutil.move(self.home.folder / name, self.home.folder / name.replace("version-5", f"version-5.{stamp}", 1))
        shutil.copy2(backup, self.home.folder / DATABASE)
        retired = VersionFourFiles(self.home.folder).retired / CODE_FOLDER
        if retired.is_dir() and not (self.home.folder / CODE_FOLDER).exists():
            shutil.copytree(retired, self.home.folder / CODE_FOLDER)
        lines.extend([f"version 5's database moved aside as version-5.{stamp}.db", f"version 4's journal.db restored from {backup}"])
