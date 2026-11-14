from collections.abc import Sequence
from engine.file.file_access import FileAccess
from pathlib import Path

PRIVATE_FOLDER_MODE = 0o700
PRIVATE_FILE_MODE = 0o600
PRIVATE_UMASK = 0o077


class PrivateFolders:
    """Makes a folder and each missing folder above it readable by its owner alone, and takes the rights of other
    accounts from a folder and the files in it that exist already."""

    @staticmethod
    def made(folder: Path) -> Path:
        for missing in reversed([folder, *folder.parents]):
            if not FileAccess.exists(missing):
                FileAccess.mkdir(missing, mode=PRIVATE_FOLDER_MODE, exist_ok=True)
        return folder

    @staticmethod
    def restricted(folder: Path, files: Sequence[Path]) -> None:
        FileAccess.chmod(folder, PRIVATE_FOLDER_MODE)
        for file in files:
            if FileAccess.exists(file):
                FileAccess.chmod(file, PRIVATE_FILE_MODE)
