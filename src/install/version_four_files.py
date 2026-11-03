import shutil
from pathlib import Path

from install.version_four_backup import BACKUP_FOLDER, DATABASE, VERSION_FILE

SIDE_FILES = ("-wal", "-shm")
CODE_FOLDER = VERSION_FILE.parent
SHELL_ENTRY = CODE_FOLDER.parent / "journal.sh"


class VersionFourFiles:
    """The files version 4 left in a project's .journal folder: its database with its side files, its code
    and the shell entry the journal command prefers when it finds one. After a good upgrade they move
    into .journal/version-4/, where the backup is, so only version 5 is live."""

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
        return moved
