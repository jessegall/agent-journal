from dataclasses import dataclass
from pathlib import Path

from engine.file.file_access import FileAccess

OLD_PATH_STORY_FILES = "tests/stories/old_path_story_files.txt"


@dataclass(frozen=True)
class OldPathStoryFiles:
    """The story files pinned to the old driving path while the new driver is built (doc 1310 section 15.2):
    each line names a story file, the slice that broke it and the test that replaces it, and the kit runs
    those files with no slice live."""

    slices: dict[str, str]
    replacements: dict[str, str]

    @classmethod
    def read(cls, root: Path) -> "OldPathStoryFiles":
        list_file = root / OLD_PATH_STORY_FILES
        lines = FileAccess.read(list_file).splitlines() if FileAccess.is_file(list_file) else []
        entries = [line.split() for line in lines if line.strip() and not line.lstrip().startswith("#")]
        malformed = [" ".join(entry) for entry in entries if len(entry) != 3]
        if malformed:
            raise ValueError(f"{OLD_PATH_STORY_FILES} lines are '<story file> <slice> <replacing test>': {malformed}")
        return cls({file: slice_name for file, slice_name, _ in entries}, {file: test for file, _, test in entries})

    def live_slices(self, story_file: str, live: tuple[str, ...]) -> tuple[str, ...]:
        return () if story_file in self.slices else live
