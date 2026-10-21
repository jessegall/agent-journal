import subprocess
from pathlib import Path

from journal.support.kept_tips import TIPS_REF
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
        done = self.git("log", "--reverse", "--format=%h %s", f"HEAD..{self.name(worker)}")
        return [line for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []

    def left(self, worker: Worker) -> list[str]:
        folder = self.folder(worker)
        if not folder.is_dir():
            return []
        done = self.git("status", "--short", cwd=folder)
        return [line[3:] for line in done.stdout.splitlines() if line.strip()] if done.returncode == 0 else []

    def take_in(self, worker: Worker) -> str:
        commits = self.ahead(worker)
        if not commits:
            return ""
        changed = self.git("diff", "--name-only", f"HEAD...{self.name(worker)}").stdout.split()
        listed, later = "; ".join(commits) + f" (files: {', '.join(changed[:20])}{', and more' if len(changed) > 20 else ''})", f"take them in with git merge {self.name(worker)}"
        blocked = self.blocked(worker)
        if blocked:
            return f"its {len(commits)} commits were not taken in, since {blocked}: {listed}; {later}"
        clashing = self.rebased(worker)
        if clashing:
            return f"its {len(commits)} commits were not taken in: rebased onto this branch they conflict in {clashing}: {listed}; {later}"
        merged = self.git("merge", "--no-edit", self.name(worker))
        if merged.returncode == 0:
            return f"its {len(commits)} commits were taken into this branch: {listed}"
        clashing = self.conflicts(self.config.root) or (merged.stderr.strip().splitlines() or ["git refused"])[-1]
        self.git("merge", "--abort")
        return f"its {len(commits)} commits were not taken in: they conflict in {clashing}: {listed}; {later}"

    def blocked(self, worker: Worker) -> str:
        if self.git("symbolic-ref", "-q", "HEAD").returncode != 0:
            return "the project is on no branch, a detached head"
        if not self.git("config", "user.name").stdout.strip() or not self.git("config", "user.email").stdout.strip():
            return "git has no user.name and user.email here, which a merge needs"
        touched = set(self.git("diff", "--name-only", f"HEAD...{self.name(worker)}").stdout.split())
        dirty = {line[3:] for line in self.git("status", "--porcelain").stdout.splitlines() if line.strip()}
        overlap = sorted(touched & dirty)
        return f"you have uncommitted changes to files they change: {', '.join(overlap)}" if overlap else ""

    def rebased(self, worker: Worker) -> str:
        tip = self.git("rev-parse", "HEAD").stdout.strip()
        if self.git("merge-base", "--is-ancestor", tip, self.name(worker)).returncode == 0:
            return ""
        folder = self.folder(worker)
        if self.git("rebase", "--autostash", tip, cwd=folder).returncode == 0:
            return ""
        clashing = self.conflicts(folder) or "its files"
        self.git("rebase", "--abort", cwd=folder)
        return clashing

    def conflicts(self, folder: Path) -> str:
        return ", ".join(self.git("diff", "--name-only", "--diff-filter=U", cwd=folder).stdout.split())

    def dropped(self, worker: Worker) -> str:
        folder = self.folder(worker)
        if not worker.worktree or not folder.is_dir():
            return ""
        if worker.is_out():
            return f"its worktree {folder} stays while it works"
        left = self.left(worker)
        if left:
            return f"its worktree {folder} stays, since {len(left)} files in it are not committed: {', '.join(left[:10])}"
        self.git("update-ref", f"{TIPS_REF}/{folder.name}", self.git("rev-parse", self.name(worker)).stdout.strip())
        self.git("worktree", "remove", str(folder))
        self.git("branch", "-D", self.name(worker))
        return f"its worktree and branch are removed; its last commit is kept as {TIPS_REF}/{folder.name}"

    def summary(self, worker: Worker) -> str:
        if not worker.worktree:
            return ""
        parts = [part for part in (self.take_in(worker), self.leftover(worker)) if part]
        return ". ".join(parts)

    def leftover(self, worker: Worker) -> str:
        files = self.left(worker)
        return f"it left {len(files)} files uncommitted in its worktree {self.folder(worker)}: {', '.join(files[:10])}" if files else ""
