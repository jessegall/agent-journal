import subprocess
from pathlib import Path

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree

GIT_LIMIT_SECONDS = 60
CHECKOUT_LIMIT_SECONDS = 300


class WorktreeGit:
    """Runs the git of a worker's worktree under a time limit; it never reads or moves the checkout's own branch."""

    def tip(self, folder: str, branch: str) -> str:
        revision = self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"refs/heads/{branch}")
        if revision.returncode != 0:
            raise Refusal(f"branch {branch} does not exist in {folder}", "make it there, or name another with journal environment edit <name> --branch <branch>")
        return revision.stdout.strip()

    def cut(self, folder: str, worktree: Worktree) -> None:
        self.checked(folder, CHECKOUT_LIMIT_SECONDS, "worktree", "add", "-b", worktree.branch, worktree.folder, worktree.base_branch)

    def remove(self, folder: str, worktree: Worktree) -> None:
        if Path(worktree.folder).exists():
            self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", worktree.folder)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        self.git(folder, GIT_LIMIT_SECONDS, "branch", "-D", worktree.branch)

    def checked(self, folder: str, limit_seconds: int, *arguments: str) -> subprocess.CompletedProcess[str]:
        finished = self.git(folder, limit_seconds, *arguments)
        if finished.returncode != 0:
            raise Refusal(f"git {' '.join(arguments[:2])} failed in {folder}", (finished.stderr or finished.stdout).strip())
        return finished

    def git(self, folder: str, limit_seconds: int, *arguments: str) -> subprocess.CompletedProcess[str]:
        try:
            return subprocess.run(["git", "-C", folder, *arguments], capture_output=True, text=True, timeout=limit_seconds, check=False)
        except subprocess.TimeoutExpired as timeout:
            raise Refusal(f"git {' '.join(arguments[:2])} took longer than {limit_seconds} seconds in {folder}", "run it again once the folder is free") from timeout
