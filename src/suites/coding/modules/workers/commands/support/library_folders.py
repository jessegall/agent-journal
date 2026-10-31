import subprocess
import sys
from collections.abc import Sequence
from pathlib import Path

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

COPY_LIMIT_SECONDS = 300
MAC_COPY = ("cp", "-cR")
LINUX_COPY = ("cp", "-a", "--reflink=auto")


class LibraryFolders:
    """Gives a worktree the environment's library folders, each linked or copied, and keeps every one out of git."""

    def __init__(self, git: WorktreeGit) -> None:
        self.git = git

    def check(self, folder: str, names: Sequence[str]) -> None:
        root = Path(folder).resolve()
        for name in names:
            library = (root / name).resolve()
            if not library.is_dir() or library == root or not library.is_relative_to(root):
                raise Refusal(f"{name} is no folder in {folder}", "name a library folder inside the environment's folder")

    def place(self, folder: str, worktree: Worktree, links: Sequence[str], copies: Sequence[str]) -> None:
        for name in links:
            (Path(worktree.folder) / name).symlink_to(Path(folder).resolve() / name, target_is_directory=True)
        for name in copies:
            self.copy(Path(folder) / name, Path(worktree.folder) / name)
        self.exclude(worktree, (*links, *copies))

    def copy(self, source: Path, target: Path) -> None:
        program = MAC_COPY if sys.platform == "darwin" else LINUX_COPY
        try:
            finished = subprocess.run([*program, str(source), str(target)], capture_output=True, text=True, timeout=COPY_LIMIT_SECONDS, check=False)
        except subprocess.TimeoutExpired as timeout:
            raise Refusal(f"copying {source} took longer than {COPY_LIMIT_SECONDS} seconds", "link it with --library-link instead") from timeout
        if finished.returncode != 0:
            raise Refusal(f"copying {source} failed", finished.stderr.strip())

    def exclude(self, worktree: Worktree, names: Sequence[str]) -> None:
        if not names:
            return
        exclude_file = self.git.exclude_file(worktree)
        lines = exclude_file.read_text().splitlines() if exclude_file.exists() else []
        added = [f"/{name}" for name in names if f"/{name}" not in lines]
        exclude_file.parent.mkdir(parents=True, exist_ok=True)
        exclude_file.write_text("\n".join([*lines, *added]) + "\n")
