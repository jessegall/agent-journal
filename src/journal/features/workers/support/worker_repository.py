from dataclasses import dataclass
from pathlib import Path

PROJECT_FOLDER = Path(".")


@dataclass(frozen=True)
class WorkerRepository:
    """One git repository a worker works in: the project's own, or one the project holds inside it and ignores, as a workspace of repositories does; its checkout in the project, the worker's worktree of it, and the folder it sits in under the project, the project's own being "."."""

    checkout: Path
    worktree: Path
    folder: Path

    @property
    def is_inner(self) -> bool:
        return self.folder != PROJECT_FOLDER

    def path(self, file: str) -> str:
        return str(self.folder / file)
