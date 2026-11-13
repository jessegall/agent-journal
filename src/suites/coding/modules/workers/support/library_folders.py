from engine.enums.process_type import ProcessType
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.file.file_access import FileAccess
import sys
from collections.abc import Sequence
from pathlib import Path

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

COPY_LIMIT_SECONDS = 300
MAC_COPY = ("cp", "-cR")
LINUX_COPY = ("cp", "-a", "--reflink=auto")


class LibraryFolders:
    """Gives a worktree the environment's library folders, each linked or copied, and keeps every one out of
    git."""

    def __init__(self, git: WorktreeGit, executor: ProcessExecutor) -> None:
        self.git, self.executor = git, executor

    def check(self, folder: str, names: Sequence[str]) -> None:
        root = Path(folder).resolve()
        for name in names:
            library = (root / name).resolve()
            if not FileAccess.is_dir(library) or library == root or not library.is_relative_to(root):
                raise Refusal(f"{name} is no folder in {folder}", "name a library folder inside the environment's folder")

    def place(self, folder: str, target: str, links: Sequence[str], copies: Sequence[str]) -> None:
        for name in dict.fromkeys(links):
            FileAccess.mkdir((Path(target) / name).parent, parents=True, exist_ok=True)
            FileAccess.symlink_to(Path(target) / name, Path(folder).resolve() / name, target_is_directory=True)
        for name in copies:
            self.copy(Path(folder) / name, Path(target) / name)
        self.exclude(target, (*links, *copies))

    def drop(self, target: str, copies: Sequence[str]) -> None:
        for name in copies:
            FileAccess.rmtree(Path(target) / name, ignore_errors=True)

    def restore(self, folder: str, target: str, copies: Sequence[str]) -> None:
        for name in copies:
            if not FileAccess.exists(Path(target) / name):
                self.copy(Path(folder) / name, Path(target) / name)

    def copy(self, source: Path, target: Path) -> None:
        program = MAC_COPY if sys.platform == "darwin" else LINUX_COPY
        try:
            finished = self.executor.execute(ExecutionRequest([*program, str(source), str(target)], source.parent, ProcessType.SHELL, COPY_LIMIT_SECONDS))
        except RunTimeLimitError as timeout:
            raise Refusal(f"copying {source} took longer than {COPY_LIMIT_SECONDS} seconds", "link it with --library-link instead") from timeout
        if not finished.succeeded:
            raise Refusal(f"copying {source} failed", finished.stderr.strip())

    def exclude(self, target: str, names: Sequence[str]) -> None:
        if not names:
            return
        exclude_file = self.git.exclude_file(target)
        lines = FileAccess.read(exclude_file).splitlines() if FileAccess.exists(exclude_file) else []
        added = [f"/{name}" for name in names if f"/{name}" not in lines]
        FileAccess.mkdir(exclude_file.parent, parents=True, exist_ok=True)
        FileAccess.write(exclude_file, "\n".join([*lines, *added]) + "\n")
