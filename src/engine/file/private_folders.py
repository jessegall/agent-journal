from pathlib import Path

PRIVATE_FOLDER_MODE = 0o700


class PrivateFolders:
    """Makes a folder and each missing folder above it readable by its owner alone."""

    @staticmethod
    def made(folder: Path) -> Path:
        for missing in reversed([folder, *folder.parents]):
            if not missing.exists():
                missing.mkdir(mode=PRIVATE_FOLDER_MODE, exist_ok=True)
        return folder
