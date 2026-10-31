import subprocess
from pathlib import Path

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree

GIT_LIMIT_SECONDS = 60
CHECKOUT_LIMIT_SECONDS = 300
WORKTREE_EXCLUDE_FILE = "journal-exclude"


class WorktreeGit:
    """Runs the git of a worker's worktree under a time limit; it never reads or moves the checkout's own branch."""

    def tip(self, folder: str, branch: str) -> str:
        revision = self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"refs/heads/{branch}")
        if revision.returncode != 0:
            raise Refusal(f"branch {branch} does not exist in {folder}", "make it there, or name another with journal environment edit <name> --branch <branch>")
        return revision.stdout.strip()

    def cut(self, folder: str, worktree: Worktree) -> None:
        self.checked(folder, CHECKOUT_LIMIT_SECONDS, "worktree", "add", "-b", worktree.branch, worktree.folder, worktree.base_branch)

    def commit(self, worktree: Worktree, message: str, trailer: str) -> bool:
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return False
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "-A")
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "-m", message, "-m", trailer)
        return True

    def head(self, folder: str) -> str:
        return self.git(folder, GIT_LIMIT_SECONDS, "symbolic-ref", "--short", "HEAD").stdout.strip()

    def rebase(self, worktree: Worktree) -> tuple[str, ...]:
        if self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "rebase", worktree.base_branch).returncode == 0:
            return ()
        conflicts = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.split()
        self.git(worktree.folder, GIT_LIMIT_SECONDS, "rebase", "--abort")
        return tuple(conflicts)

    def uncommitted_overlap(self, folder: str, worktree: Worktree) -> tuple[str, ...]:
        changed = set(self.checked(folder, GIT_LIMIT_SECONDS, "diff", "--name-only", f"{worktree.base_branch}...{worktree.branch}").stdout.split())
        uncommitted = {line[3:] for line in self.checked(folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.splitlines()}
        return tuple(sorted(changed & uncommitted))

    def merge(self, folder: str, worktree: Worktree, message: str) -> None:
        finished = self.git(folder, CHECKOUT_LIMIT_SECONDS, "merge", "--no-ff", "-m", message, worktree.branch)
        if finished.returncode != 0:
            self.git(folder, GIT_LIMIT_SECONDS, "merge", "--abort")
            raise Refusal(f"git merge of {worktree.branch} failed in {folder}", (finished.stderr or finished.stdout).strip())

    def exclude_file(self, folder: str) -> Path:
        git_folder = Path(self.checked(folder, GIT_LIMIT_SECONDS, "rev-parse", "--absolute-git-dir").stdout.strip())
        exclude_file = git_folder / WORKTREE_EXCLUDE_FILE
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "extensions.worktreeConfig", "true")
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "--worktree", "core.excludesFile", str(exclude_file))
        return exclude_file

    def remove(self, folder: str, worktree: Worktree) -> bool:
        if Path(worktree.folder).exists():
            self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", worktree.folder)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        unmerged = self.git(folder, GIT_LIMIT_SECONDS, "rev-list", "--count", f"refs/heads/{worktree.base_branch}..refs/heads/{worktree.branch}")
        if unmerged.returncode == 0 and unmerged.stdout.strip() != "0":
            return True
        self.git(folder, GIT_LIMIT_SECONDS, "branch", "-D", worktree.branch)
        return False

    def changed_files(self, worktree: Worktree) -> tuple[str, ...]:
        tracked = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", worktree.base_commit).stdout.splitlines()
        untracked = self.git(worktree.folder, GIT_LIMIT_SECONDS, "ls-files", "--others", "--exclude-standard").stdout.splitlines()
        return tuple(dict.fromkeys(path for path in (*tracked, *untracked) if path))

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
