import shutil
from pathlib import Path

from install.version_four_backup import BACKUP_FOLDER, DATABASE, VERSION_FILE

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
        return (self.retired / DATABASE).is_file()

    def database(self) -> Path:
        return self.retired / DATABASE

    def retire(self) -> list[str]:
        self.retired.mkdir(parents=True, exist_ok=True)
        moved: list[str] = []
        present = [name for name in (DATABASE, *(f"{DATABASE}{suffix}" for suffix in SIDE_FILES)) if (self.journal / name).exists()]
        for name in present:
            shutil.move(self.journal / name, self.retired / name)
            moved.append(name)
        if (self.journal / CODE_FOLDER).is_dir():
            (self.retired / CODE_FOLDER).parent.mkdir(parents=True, exist_ok=True)
            shutil.move(self.journal / CODE_FOLDER, self.retired / CODE_FOLDER)
            moved.append(str(CODE_FOLDER))
        if (self.journal / SHELL_ENTRY).is_file():
            (self.retired / SHELL_ENTRY).parent.mkdir(parents=True, exist_ok=True)
            shutil.move(self.journal / SHELL_ENTRY, self.retired / SHELL_ENTRY)
            moved.append(str(SHELL_ENTRY))
        if (self.journal / READERS_FOLDER).is_dir() and not (self.retired / READERS_FOLDER).exists():
            shutil.move(self.journal / READERS_FOLDER, self.retired / READERS_FOLDER)
            moved.append(str(READERS_FOLDER))
        return moved
