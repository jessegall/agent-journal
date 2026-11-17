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
COMPOSER_FOLDER = "vendor"
COMPOSER_MANIFEST = "composer.json"
MAC_COPY = ("cp", "-cR")
LINUX_COPY = ("cp", "-a", "--reflink=auto")


class LibraryFolders:
    """Gives a worktree the environment's library folders, each linked or copied, and keeps every one out of
    git. A copy may also be a single file, such as a gitignored .env. Composer's vendor folder is always copied:
    its autoloader resolves its real path, so through a link the worktree's PHP would load the main checkout's
    classes and a composer command in the worktree would rewrite the main checkout's autoload files."""

    def __init__(self, git: WorktreeGit, executor: ProcessExecutor) -> None:
        self.git, self.executor = git, executor

    def check(self, folder: str, links: Sequence[str], copies: Sequence[str]) -> None:
        root = Path(folder).resolve()
        for name in links:
            if not FileAccess.is_dir(self.inside(root, name)):
                raise Refusal(f"{name} is no folder in {folder}", "name a library folder inside the environment's folder")
            if self.is_composer_folder(folder, name):
                raise Refusal(f"{name} is Composer's vendor folder: through a link the worktree's PHP loads the main checkout's classes", f"copy it with --library-copy {name}")
        for name in copies:
            if not FileAccess.exists(self.inside(root, name)):
                raise Refusal(f"{name} is no folder or file in {folder}", "name a library folder or file inside the environment's folder")

    @staticmethod
    def inside(root: Path, name: str) -> Path:
        library = (root / name).resolve()
        if library == root or not library.is_relative_to(root):
            raise Refusal(f"{name} is not inside {root}", "name a library folder inside the environment's folder")
        return library

    @staticmethod
    def is_composer_folder(folder: str, name: str) -> bool:
        library = Path(folder) / name
        return library.name == COMPOSER_FOLDER and FileAccess.is_file(library.parent / COMPOSER_MANIFEST)

    def place(self, folder: str, target: str, links: Sequence[str], copies: Sequence[str]) -> None:
        for name in dict.fromkeys(links):
            FileAccess.mkdir((Path(target) / name).parent, parents=True, exist_ok=True)
            FileAccess.symlink_to(Path(target) / name, Path(folder).resolve() / name, target_is_directory=True)
        for name in copies:
            self.copy(Path(folder) / name, Path(target) / name)
        self.exclude(target, (*links, *copies))

    # a link is removed as a link, never followed, so the environment's own folder is untouched
    def drop(self, target: str, links: Sequence[str], copies: Sequence[str]) -> None:
        for name in links:
            if FileAccess.is_symlink(Path(target) / name):
                FileAccess.unlink(Path(target) / name, missing_ok=True)
        for name in copies:
            if FileAccess.is_dir(Path(target) / name):
                FileAccess.rmtree(Path(target) / name, ignore_errors=True)
            else:
                FileAccess.unlink(Path(target) / name, missing_ok=True)

    def restore(self, folder: str, target: str, links: Sequence[str], copies: Sequence[str]) -> None:
        for name in [name for name in links if not FileAccess.is_symlink(Path(target) / name) and not FileAccess.exists(Path(target) / name)]:
            FileAccess.mkdir((Path(target) / name).parent, parents=True, exist_ok=True)
            FileAccess.symlink_to(Path(target) / name, Path(folder).resolve() / name, target_is_directory=True)
        for name in [name for name in copies if not FileAccess.exists(Path(target) / name)]:
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
