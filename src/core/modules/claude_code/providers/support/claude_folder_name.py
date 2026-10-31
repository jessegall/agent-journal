import re
from pathlib import Path

UNSAFE_CHARACTER = re.compile(r"[^A-Za-z0-9]")


class ClaudeFolderName:
    """The folder name Claude Code keeps a project's sessions under: the project's path with every character that
    is not a letter or a digit written as a dash."""

    @staticmethod
    def folder_name(project: Path) -> str:
        return UNSAFE_CHARACTER.sub("-", str(project))
