import subprocess
from pathlib import Path

from journal.config import Config
from journal.models.worker import Worker

GIT_TIMEOUT = 30


class WorkerBranch:
    """A worker's worktree and the branch it commits on: what it left there when it ended, and its commits taken into the branch the project is on."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def name(self, worker: Worker) -> str:
        return f"worker/{worker.id}-{worker.name}".replace(" ", "-")

    def folder(self, worker: Worker) -> Path:
        return self.config.home / "worktrees" / f"{worker.id}-{worker.name}".replace(" ", "-")

    def git(self, *argv: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd or self.config.root, capture_output=True, text=True, timeout=GIT_TIMEOUT)

    def ahead(self, worker: Worker) -> list[str]:
        """The worker's commits not yet in the branch the project is on, oldest first, by short hash and subject."""
        done = self.git("log", "--reverse", "--format=%h %s", f"HEAD..{self.name(worker)}")
        return [line for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []

    def left(self, worker: Worker) -> list[str]:
        """The files the worker changed in its worktree and never committed."""
        folder = self.folder(worker)
        if not folder.is_dir():
            return []
        done = self.git("status", "--short", cwd=folder)
        return [line[3:] for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []

    def take_in(self, worker: Worker) -> str:
        """The worker's commits merged into the branch the project is on, in words; a merge git refuses or that conflicts is undone and named instead."""
        commits = self.ahead(worker)
        if not commits:
            return ""
        listed = "; ".join(commits)
        merged = self.git("merge", "--no-edit", self.name(worker))
        if merged.returncode == 0:
            return f"its {len(commits)} commits were taken into this branch: {listed}"
        self.git("merge", "--abort")
        return f"its {len(commits)} commits could not be taken in on their own ({merged.stderr.strip().splitlines()[-1] if merged.stderr.strip() else 'git refused'}): {listed}; take them in with git merge {self.name(worker)}"

    def summary(self, worker: Worker) -> str:
        """What the worker's branch and worktree hold once it ended, for its report; empty for a worker with no worktree."""
        if not worker.worktree:
            return ""
        parts = [part for part in (self.take_in(worker), self.leftover(worker)) if part]
        return ". ".join(parts)

    def leftover(self, worker: Worker) -> str:
        files = self.left(worker)
        return f"it left {len(files)} files uncommitted in its worktree {self.folder(worker)}: {', '.join(files[:10])}" if files else ""
