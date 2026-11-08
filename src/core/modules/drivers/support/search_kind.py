import os
from pathlib import Path

from core.base.driver.tool import Tool

GRAPHIFY = "graphify"
CODE = "code"
JOURNAL_FOLDER = ".journal"
WORKTREES_FOLDER = "worktrees"


class SearchKind:
    """What a tool use searches: the code through Graphify, the code of the project with any other search, or
    nothing the journal counts, such as no search at all or a search of logs and outputs outside the code."""

    @classmethod
    def of(cls, tool: Tool | None, folder: str, project: Path) -> str:
        if tool is None:
            return ""
        if tool.uses_graphify:
            return GRAPHIFY
        if tool.is_search and cls.is_in_code(tool.searched_paths, folder, project):
            return CODE
        return ""

    @classmethod
    def is_in_code(cls, paths: tuple[str, ...], folder: str, project: Path) -> bool:
        base = folder or str(project)
        if not paths:
            return cls.is_code_folder(Path(os.path.normpath(base)), project)
        return any(cls.is_code_folder(Path(os.path.normpath(os.path.join(base, path))), project) for path in paths)

    @staticmethod
    def is_code_folder(path: Path, project: Path) -> bool:
        if not path.is_relative_to(project):
            return False
        inside = path.relative_to(project).parts
        return not inside or inside[0] != JOURNAL_FOLDER or inside[1:2] == (WORKTREES_FOLDER,)
