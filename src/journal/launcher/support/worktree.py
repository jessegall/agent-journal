import subprocess
from pathlib import Path

from journal.launcher.support.worktree_not_made import WorktreeNotMade

GIT_SECONDS = 60


class Worktree:
    """The git worktree a launch works in, at .claude/worktrees/<name> on the branch worktree-<name>, where Claude Code keeps its own: made when it is not there, and never removed by the journal or handed to the agent to remove."""

    def __init__(self, root: Path, name: str) -> None:
        self.root, self.name = root, name

    @property
    def path(self) -> Path:
        return self.root / ".claude" / "worktrees" / self.name

    @property
    def branch(self) -> str:
        return f"worktree-{self.name}"

    def made(self) -> Path:
        if self.path.is_dir():
            return self.path
        self.git("worktree", "prune")
        if self.git("rev-parse", "--verify", "--quiet", f"refs/heads/{self.branch}").returncode == 0:
            added = self.git("worktree", "add", str(self.path), self.branch)
        else:
            added = self.git("worktree", "add", "-b", self.branch, str(self.path))
        if added.returncode != 0:
            raise WorktreeNotMade(self.name, added.stderr.strip())
        return self.path

    def git(self, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(["git", "-C", str(self.root), *args], capture_output=True, text=True, timeout=GIT_SECONDS)
