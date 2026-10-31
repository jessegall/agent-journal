import shutil
from pathlib import Path

from install.version_four_backup import BACKUP_FOLDER, DATABASE, VERSION_FILE

SIDE_FILES = ("-wal", "-shm")
CODE_FOLDER = VERSION_FILE.parent


class VersionFourFiles:
    """The files version 4 left in a project's .journal folder: its database with its side files, and its code. After
    a good upgrade they move into .journal/version-4/, where the backup is, so only version 5 is live."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal
        self.retired = journal / BACKUP_FOLDER

    def are_retired(self) -> bool:
        return (self.retired / DATABASE).is_file()

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
        return moved
