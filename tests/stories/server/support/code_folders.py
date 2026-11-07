from collections.abc import Sequence
from pathlib import Path

from server.code_folders import CodeFolders


class SampleCodeFolders(CodeFolders):
    """Code folders a story names itself, so a story changes a file of its own and never the journal's code."""

    def __init__(self, sample_folders: Sequence[Path]) -> None:
        self.sample_folders = sample_folders

    def folders(self) -> Sequence[Path]:
        return self.sample_folders
