import os
from pathlib import Path


class FolderStat:
    """Facts about a folder that another test run may remove while they are read."""

    @staticmethod
    def modified_time(folder: Path) -> float:
        try:
            return folder.stat().st_mtime
        except FileNotFoundError:
            return 0.0

    @staticmethod
    def bytes(folder: Path) -> int:
        total = 0
        for parent, _, names in os.walk(folder):
            for name in names:
                try:
                    total += os.lstat(os.path.join(parent, name)).st_size
                except FileNotFoundError:
                    continue
        return total
