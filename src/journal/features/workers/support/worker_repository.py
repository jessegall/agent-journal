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

    @property
    def is_present(self) -> bool:
        return (self.worktree / ".git").exists()

    def path(self, file: str) -> str:
        return f"{self.folder}/{file}" if self.is_inner else file

    def label(self) -> str:
        return str(self.folder) if self.is_inner else "the project"
