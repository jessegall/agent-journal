import hashlib
from dataclasses import dataclass
from pathlib import Path

from engine.file.file_access import FileAccess

STAMP_NAME = "sources.sha256"
SKIPPED_FOLDERS = frozenset({"node_modules", "dist", "__pycache__"})


@dataclass(frozen=True)
class BuiltBundle:
    """A built viewer folder and the source files it was built from; the build leaves a stamp in the folder holding
    the hash of those files, so a bundle whose sources changed since is told apart from one that is current."""

    dist: Path
    sources: tuple[Path, ...]

    @property
    def stamp(self) -> Path:
        return self.dist / STAMP_NAME

    def digest(self) -> str:
        digest = hashlib.sha256()
        for root in self.sources:
            for file in self.files(root):
                digest.update(f"{file.relative_to(root.parent).as_posix()}\0".encode())
                digest.update(FileAccess.binary(file))
        return digest.hexdigest()

    def is_current(self) -> bool:
        return FileAccess.is_file(self.stamp) and FileAccess.read(self.stamp).strip() == self.digest()

    def write_stamp(self) -> None:
        FileAccess.write(self.stamp, self.digest() + "\n")

    @staticmethod
    def files(root: Path) -> list[Path]:
        if FileAccess.is_file(root):
            return [root]
        return sorted(path for path in FileAccess.rglob(root, "*") if FileAccess.is_file(path) and not SKIPPED_FOLDERS.intersection(path.relative_to(root).parts))
