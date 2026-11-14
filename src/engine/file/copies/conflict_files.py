from engine.file.file_access import FileAccess
import os
from pathlib import Path

from engine.errors.refusal import Refusal

IGNORED_FOLDERS = frozenset({".git", ".journal", ".venv", "node_modules", "__pycache__"})
MARKER_PREFIXES = (b"<" * 7, b">" * 7, b"|" * 7)


class ConflictFiles:
    """Finds unresolved merge markers, including longer markers from rename conflicts."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def paths(self) -> tuple[str, ...]:
        return tuple(sorted(str(path.relative_to(self.folder)) for path in self.files() if self.has_marker(path)))

    def files(self):
        for folder, directories, names in FileAccess.walk_folders(self.folder):
            directories[:] = [name for name in directories if name not in IGNORED_FOLDERS]
            for name in names:
                path = Path(folder, name)
                if not FileAccess.is_symlink(path) and FileAccess.is_file(path):
                    yield path

    def has_marker(self, path: Path) -> bool:
        with FileAccess.reader(path, "rb") as file:
            return any(line.startswith(MARKER_PREFIXES) for line in file)

    def check(self) -> None:
        paths = self.paths()
        if paths:
            raise Refusal(f"conflict markers remain in {', '.join(paths)}", "resolve the markers, then try again")
