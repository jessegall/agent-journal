from engine.file.file_access import FileAccess
import shutil
from pathlib import Path

from install.backup.version_four_backup import BACKUP_FOLDER, DATABASE, VERSION_FILE

SIDE_FILES = ("-wal", "-shm")
CODE_FOLDER = VERSION_FILE.parent
SHELL_ENTRY = CODE_FOLDER.parent / "journal.sh"
READERS_FOLDER = Path("readers")


class VersionFourFiles:
    """Moves the version 4 database, code, shell entry and reader files into its backup folder after an upgrade."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal
        self.retired = journal / BACKUP_FOLDER

    def are_retired(self) -> bool:
        return FileAccess.is_file(self.retired / DATABASE)

    def database(self) -> Path:
        return self.retired / DATABASE

    def retire(self) -> list[str]:
        FileAccess.mkdir(self.retired, parents=True, exist_ok=True)
        moved: list[str] = []
        present = [name for name in (DATABASE, *(f"{DATABASE}{suffix}" for suffix in SIDE_FILES)) if FileAccess.exists(self.journal / name)]
        for name in present:
            FileAccess.move(self.journal / name, self.retired / name)
            moved.append(name)
        if FileAccess.is_dir(self.journal / CODE_FOLDER):
            FileAccess.mkdir((self.retired / CODE_FOLDER).parent, parents=True, exist_ok=True)
            FileAccess.move(self.journal / CODE_FOLDER, self.retired / CODE_FOLDER)
            moved.append(str(CODE_FOLDER))
        if FileAccess.is_file(self.journal / SHELL_ENTRY):
            FileAccess.mkdir((self.retired / SHELL_ENTRY).parent, parents=True, exist_ok=True)
            FileAccess.move(self.journal / SHELL_ENTRY, self.retired / SHELL_ENTRY)
            moved.append(str(SHELL_ENTRY))
        if FileAccess.is_dir(self.journal / READERS_FOLDER) and not FileAccess.exists(self.retired / READERS_FOLDER):
            FileAccess.move(self.journal / READERS_FOLDER, self.retired / READERS_FOLDER)
            moved.append(str(READERS_FOLDER))
        return moved
