import os
from pathlib import Path

from engine.driver.hook_event import HookEvent
from engine.journal.journal_home import JOURNAL_FOLDER

GRAPHIFY = "graphify"
CODE = "code"
WORKTREES_FOLDER = "worktrees"


class SearchCategory:
    """What a tool use searches: the code through Graphify, the code of the project with any other search, or
    nothing the journal counts, such as no search at all or a search of logs and outputs outside the code."""

    @classmethod
    def classify(cls, event: HookEvent, project: Path) -> str:
        tool = event.tool
        if tool is None:
            return ""
        if tool.uses_graphify:
            return GRAPHIFY
        if tool.is_search and cls.searches_code(tool.searched_paths, event.folder, project):
            return CODE
        return ""

    @classmethod
    def searches_code(cls, paths: tuple[str, ...], folder: str, project: Path) -> bool:
        base = folder or str(project)
        if not paths:
            return cls.is_code_folder(Path(os.path.normpath(base)), project)
        return any(cls.is_code_folder(Path(os.path.normpath(os.path.join(base, path))), project) for path in paths)

    @staticmethod
    def is_code_folder(path: Path, project: Path) -> bool:
        if not path.is_relative_to(project):
            return False
        parts = path.relative_to(project).parts
        return not parts or parts[0] != JOURNAL_FOLDER or parts[1:2] == (WORKTREES_FOLDER,)
