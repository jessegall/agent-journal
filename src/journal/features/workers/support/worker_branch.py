import shutil
import subprocess
from journal.support.rejection import Rejection
from pathlib import Path

from journal.support.worktree_refs import TIPS_REF
from journal.config import Config
from journal.models.worker import Worker
from journal.support.listener_queue import ListenerQueue

GIT_TIMEOUT_SECONDS = 30


class WorkerBranch:
    """A worker's worktree and the branch it commits on: what it left there when it ended, and its commits taken into the branch the project is on."""

    def __init__(self, config: Config, deferred: ListenerQueue) -> None:
        self.config, self.deferred = config, deferred
        self.removed_root = config.home / "removed-worktrees"

    def name(self, worker: Worker) -> str:
        return f"worker/{worker.id}-{worker.name}".replace(" ", "-")

    def folder(self, worker: Worker) -> Path:
        return self.config.home / "worktrees" / f"{worker.id}-{worker.name}".replace(" ", "-")

    def place(self, worker: Worker) -> Path:
        return self.folder(worker) if worker.worktree else self.config.root

    def git(self, *argv: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd or self.config.root, capture_output=True, text=True, timeout=GIT_TIMEOUT_SECONDS)

    def touched(self, worker: Worker) -> tuple[str, ...] | None:
        name = self.name(worker)
        if not worker.worktree or self.git("rev-parse", "--verify", "-q", f"refs/heads/{name}").returncode != 0:
            return None
        changed = self.git("diff", "--name-status", "-M", f"HEAD...{name}")
        if changed.returncode != 0:
            return None
        return tuple(dict.fromkeys(path for line in changed.stdout.splitlines() for path in line.split("\t")[1:]))

    def commit_count(self, worker: Worker) -> list[str]:
        finished = self.git("log", "--reverse", "--format=%h %s", f"HEAD..{self.name(worker)}")
        return [line for line in finished.stdout.splitlines() if line.strip()] if finished.returncode == 0 else []

    def remaining(self, worker: Worker) -> list[str]:
        folder = self.folder(worker)
        if not folder.is_dir():
            return []
        finished = self.git("status", "--short", cwd=folder)
        return [line[3:] for line in finished.stdout.splitlines() if line.strip()] if finished.returncode == 0 else []

    def merge(self, worker: Worker) -> str:
        commits = self.commit_count(worker)
        if not commits:
            return ""
        changed = self.git("diff", "--name-only", f"HEAD...{self.name(worker)}").stdout.split()
        listed, later = "; ".join(commits) + f" (files: {', '.join(changed[:20])}{', and more' if len(changed) > 20 else ''})", f"take them in with git merge {self.name(worker)}"
        refusal = self.refusal(worker)
        if refusal:
            return f"its {len(commits)} commits were not taken in, since {refusal}: {listed}; {later}"
        return f"its {len(commits)} commits were taken into this branch: {listed}"

    def merge_commit(self, worker: Worker) -> str:
        refusal = self.refusal(worker)
        if refusal:
            raise Rejection(f"worker {worker.id}'s work was not merged, since {refusal}; its proofs, its task and its worktree are as they were")
        return self.git("rev-parse", "HEAD").stdout.strip()

    def refusal(self, worker: Worker) -> str:
        blocked = self.blocked(worker)
        if blocked:
            return blocked
        clashing = self.rebased(worker)
        if clashing:
            return f"rebased onto this branch there is a conflict in {clashing}"
        merged = self.git("merge", "--no-edit", self.name(worker))
        if merged.returncode == 0:
            return ""
        clashing = self.conflicts(self.config.root) or (merged.stderr.strip().splitlines() or ["git refused"])[-1]
        self.git("merge", "--abort")
        return f"there is a conflict in {clashing}"

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
        if worker.is_running():
            return f"its worktree {folder} stays while it works"
        leftover = self.remaining(worker)
        if leftover:
            return f"its worktree {folder} stays, since {len(leftover)} files in it are not committed: {', '.join(leftover[:10])}"
        self.git("update-ref", f"{TIPS_REF}/{folder.name}", self.name(worker))
        self.removed(folder, self.name(worker))
        return f"its worktree and branch are removed; its last commit is kept as {TIPS_REF}/{folder.name}"

    def removed(self, folder: Path, branch: str) -> None:
        self.removed_root.mkdir(parents=True, exist_ok=True)
        folder.rename(self.removed_root / folder.name)
        self.deferred.add(lambda: self.cleared(branch))

    def cleared(self, branch: str) -> None:
        self.git("worktree", "prune")
        self.git("branch", "-D", branch)
        for folder in self.removed_root.iterdir():
            shutil.rmtree(folder)

    def summary(self, worker: Worker) -> str:
        if not worker.worktree:
            return ""
        parts = [part for part in (self.merge(worker), self.leftover(worker)) if part]
        return ". ".join(parts)

    def leftover(self, worker: Worker) -> str:
        files = self.remaining(worker)
        return f"it left {len(files)} files uncommitted in its worktree {self.folder(worker)}: {', '.join(files[:10])}" if files else ""
