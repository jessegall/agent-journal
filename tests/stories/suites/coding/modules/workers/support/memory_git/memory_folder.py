import os
from fnmatch import fnmatch
from pathlib import Path

from tests.stories.suites.coding.modules.workers.support.memory_git.git_story_required import GitStoryRequired

IGNORE_FILE = ".gitignore"
EXCLUDE_FILE = "journal-exclude"
MEMORY_FOLDER = ".journal/memory-git"


class MemoryFolder:
    """The files of one folder of an in-memory repository: what a commit would hold, and writing a commit's files
    back. A name counts as ignored when the folder's ignore file or its exclude file hides it."""

    def __init__(self, root: Path, folder: Path) -> None:
        self.root, self.folder = root.resolve(), folder

    def exclude_file(self) -> Path:
        name = "root" if self.folder.resolve() == self.root else self.folder.name
        return self.root / MEMORY_FOLDER / name / EXCLUDE_FILE

    def patterns(self) -> list[str]:
        sources = [self.folder / IGNORE_FILE, self.exclude_file()]
        lines = [line.strip() for source in sources if source.is_file() for line in source.read_text().splitlines()]
        return [line for line in lines if line and not line.startswith("#")]

    def hides(self, relative: str, patterns: list[str]) -> bool:
        parts = relative.split("/")
        return any(self.matches(relative, parts, pattern) for pattern in patterns)

    @staticmethod
    def matches(relative: str, parts: list[str], pattern: str) -> bool:
        if pattern.startswith("!"):
            raise GitStoryRequired(f"the ignore pattern {pattern} needs real git")
        name = pattern.strip("/")
        if pattern.startswith("/") or "/" in name:
            return relative == name or relative.startswith(f"{name}/")
        return any(fnmatch(part, name) for part in parts)

    def snapshot(self, held: dict[str, str] | None = None) -> dict[str, str]:
        patterns = self.patterns()
        files: dict[str, str] = {}
        for current, directories, names in os.walk(self.folder):
            relative_folder = Path(current).relative_to(self.folder).as_posix()
            directories[:] = sorted(name for name in directories if not self.hides(self.joined(relative_folder, name), patterns) and not Path(current, name).is_symlink())
            for name in names:
                relative = self.joined(relative_folder, name)
                if not self.hides(relative, patterns) and not Path(current, name).is_symlink():
                    files[relative] = Path(current, name).read_text(errors="surrogateescape")
        return {**files, **(held or {})}

    @staticmethod
    def joined(folder: str, name: str) -> str:
        return name if folder == "." else f"{folder}/{name}"

    def write(self, tree: dict[str, str], removed: tuple[str, ...] = ()) -> None:
        for name in removed:
            (self.folder / name).unlink(missing_ok=True)
        for name, text in tree.items():
            path = self.folder / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, errors="surrogateescape")
