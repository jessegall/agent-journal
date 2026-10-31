import os
import shlex
import subprocess
from pathlib import Path

from core.testing.story import Story
from tests.stories.core.support import story_lines as lines

GIT_TIMEOUT_SECONDS = 30
CHECKOUT_BRANCH = "main"
ENVIRONMENT_BRANCH = "version-5"
ENVIRONMENT = "main"
WORKER_BRANCHES = "journal/*"
GIT_ENVIRONMENT = {**os.environ, "GIT_CONFIG_GLOBAL": os.devnull, "GIT_CONFIG_NOSYSTEM": "1"}
STORY_GIT_CONFIG = ("-c", "user.name=Story", "-c", "user.email=story@example.com", "-c", "commit.gpgsign=false")


class GitRepository:
    """A git repository made in a story's own folder, with main checked out and the environment's branch version-5
    one commit ahead of it, and the checks a story makes of its branches, worktrees and folders."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    @classmethod
    def made(cls, folder: Path) -> "GitRepository":
        folder.mkdir(parents=True)
        repository = cls(folder)
        repository.git("init", "--initial-branch", CHECKOUT_BRANCH)
        repository.committed(".gitignore", ".journal\n", "The first commit")
        repository.git("checkout", "-b", ENVIRONMENT_BRANCH)
        repository.committed("cart.py", "TOTAL = 0\n", "The cart")
        repository.git("checkout", CHECKOUT_BRANCH)
        return repository

    def git(self, *arguments: str, folder: Path | None = None) -> subprocess.CompletedProcess[str]:
        return subprocess.run(["git", *STORY_GIT_CONFIG, "-C", str(folder or self.folder), *arguments], env=GIT_ENVIRONMENT, capture_output=True, text=True,
                              timeout=GIT_TIMEOUT_SECONDS, check=False)

    def committed(self, name: str, text: str, message: str) -> None:
        (self.folder / name).write_text(text)
        self.git("add", name)
        self.git("commit", "-m", message)

    def library(self, name: str, file_name: str, text: str) -> None:
        (self.folder / name).mkdir()
        (self.folder / name / file_name).write_text(text)

    def tip(self, branch: str) -> str:
        return self.git("rev-parse", f"refs/heads/{branch}").stdout.strip()

    def worktree_folder(self, worker_id: int) -> Path:
        return self.folder / ".journal" / "worktrees" / ENVIRONMENT / f"worker-{worker_id}"

    def worker_branch(self, worker_id: int) -> str:
        return f"journal/{ENVIRONMENT}/worker-{worker_id}"

    def expect_branch_at(self, branch: str, commit: str) -> None:
        assert self.tip(branch) == commit, f"branch {branch} is at {self.tip(branch)!r}, not {commit}"

    def expect_checked_out(self, branch: str, folder: Path | None = None) -> None:
        head = self.git("symbolic-ref", "--short", "HEAD", folder=folder).stdout.strip()
        assert head == branch, f"{folder or self.folder} has {head!r} checked out, not {branch}"

    def expect_nothing_cut(self) -> None:
        branches = self.git("branch", "--list", WORKER_BRANCHES).stdout.split()
        worktrees = [line for line in self.git("worktree", "list", "--porcelain").stdout.splitlines() if line.startswith("worktree ")]
        folders = list((self.folder / ".journal" / "worktrees").rglob("*"))
        assert (branches, len(worktrees), folders) == ([], 1, []), f"a worktree was left: branches {branches}, worktrees {worktrees}, folders {folders}"

    def expect_excluded(self, worker_id: int, name: str) -> None:
        folder = self.worktree_folder(worker_id)
        ignored = self.git("check-ignore", "-q", "--no-index", name, folder=folder).returncode == 0
        status = self.git("status", "--porcelain", "--untracked-files=all", folder=folder).stdout
        assert ignored and name not in status, f"git sees {name} in {folder}: {status}"

    def expect_link(self, worker_id: int, name: str) -> None:
        library = self.worktree_folder(worker_id) / name
        assert library.is_symlink() and library.resolve() == (self.folder / name).resolve(), f"{library} is no link to {self.folder / name}"

    def expect_copy(self, worker_id: int, name: str, file_name: str, text: str) -> None:
        library = self.worktree_folder(worker_id) / name
        assert library.is_dir() and not library.is_symlink(), f"{library} is no copied folder"
        assert (library / file_name).read_text() == text, f"{library / file_name} does not hold {text!r}"


def repository_environment(story: Story, branch: str = ENVIRONMENT_BRANCH) -> GitRepository:
    repository = GitRepository.made(story.home.folder.parent / "project")
    branch_flag = f" --branch {branch}" if branch else ""
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(repository.folder))}{branch_flag}", f"folder: {repository.folder}")
    return repository


def expect_nothing_dispatched(story: Story, repository: GitRepository) -> None:
    story.expect_success("worktree list", "nothing found")
    story.expect_success("agent list --role worker", "nothing found")
    story.expect_success(lines.TASK_DETAILS, "state: open")
    repository.expect_nothing_cut()
