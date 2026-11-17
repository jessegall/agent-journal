from collections.abc import Iterable
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess

MARKER_PREFIXES = (b"<" * 7, b">" * 7, b"|" * 7)


class ConflictMarkers:
    """Finds unresolved merge markers, including longer markers from rename conflicts, in the files named below a
    folder: the files a merge or a worktree changed, so a check never reads a whole project."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def paths(self, names: Iterable[str]) -> tuple[str, ...]:
        return tuple(sorted(name for name in dict.fromkeys(names) if self.has_marker(self.folder / name)))

    def has_marker(self, path: Path) -> bool:
        if FileAccess.is_symlink(path) or not FileAccess.is_file(path):
            return False
        with FileAccess.reader(path, "rb") as file:
            return any(line.startswith(MARKER_PREFIXES) for line in file)

    def check(self, names: Iterable[str]) -> None:
        paths = self.paths(names)
        if paths:
            raise Refusal(f"conflict markers remain in {', '.join(paths)}", "resolve the markers, then try again")
