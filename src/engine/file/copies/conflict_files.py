from pathlib import Path

from engine.file.copies.conflict_markers import ConflictMarkers
from engine.file.file_access import CODE_TREE_DEPTH, FileAccess

IGNORED_FOLDERS = frozenset({".git", ".journal", ".venv", "node_modules", "__pycache__"})


class ConflictFiles:
    """Finds unresolved merge markers in every file of one of the journal's own code trees; a project or a worktree
    is checked through ConflictMarkers on the files that changed."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.markers = ConflictMarkers(folder)

    def paths(self) -> tuple[str, ...]:
        return self.markers.paths(str(path.relative_to(self.folder)) for path in self.files())

    def files(self):
        for folder, directories, names in FileAccess.walk_folders(self.folder, CODE_TREE_DEPTH):
            directories[:] = [name for name in directories if name not in IGNORED_FOLDERS]
            yield from (Path(folder, name) for name in names)

    def has_marker(self, path: Path) -> bool:
        return self.markers.has_marker(path)

    def check(self) -> None:
        self.markers.check(str(path.relative_to(self.folder)) for path in self.files())
