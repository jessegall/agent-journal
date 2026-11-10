import os
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar


class FolderListing:
    """The Python files under some folders, listed again only when one of their folders changes: a file added,
    removed or renamed changes its folder's change time, so a check costs a stat of each folder, not a walk.
    One listing is kept for each set of folders in a process.
    """

    kept_listings: ClassVar[dict[tuple[Path, ...], "FolderListing"]] = {}

    def __init__(self, folders: Sequence[Path]) -> None:
        self.folders = list(folders)
        self.folder_modified_ns: dict[str, int] = {}
        self.python_files: list[Path] = []

    @classmethod
    def kept(cls, folders: Sequence[Path]) -> "FolderListing":
        key = tuple(folders)
        if key not in cls.kept_listings:
            cls.kept_listings[key] = cls(folders)
        return cls.kept_listings[key]

    def files(self) -> list[Path]:
        if not self.folder_modified_ns or any(self.changed(folder, time) for folder, time in self.folder_modified_ns.items()):
            self.walk()
        return self.python_files

    @staticmethod
    def changed(folder: str, time: int) -> bool:
        try:
            return os.stat(folder).st_mtime_ns != time
        except FileNotFoundError:
            return True

    def walk(self) -> None:
        folder_modified_ns: dict[str, int] = {}
        files: set[Path] = set()
        for root in self.folders:
            for folder, _, names in os.walk(root):
                folder_modified_ns[folder] = os.stat(folder).st_mtime_ns
                files.update(Path(folder) / name for name in names if name.endswith(".py"))
        self.folder_modified_ns, self.python_files = folder_modified_ns, sorted(files)
