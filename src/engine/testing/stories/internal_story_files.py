from pathlib import Path

from engine.file.file_access import FileAccess

INTERNAL_STORY_FILES = "tests/stories/internal_story_files.txt"


class InternalStoryFiles:
    """The story files that may still reach the journal's internals, read once from a list that only shrinks: only
    their stories pass the overlap check by; every other story is checked for repeats (plan 1138)."""

    def __init__(self, root: Path) -> None:
        self.root = root
        list_file = root / INTERNAL_STORY_FILES
        lines = FileAccess.read(list_file).splitlines() if FileAccess.is_file(list_file) else []
        self.files = frozenset(line.strip() for line in lines if line.strip() and not line.lstrip().startswith("#"))

    def holds(self, story_file: Path) -> bool:
        if not story_file.is_relative_to(self.root):
            return False
        return story_file.relative_to(self.root).as_posix() in self.files
