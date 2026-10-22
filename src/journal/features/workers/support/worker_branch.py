import shutil
import subprocess
from pathlib import Path

from journal.config import Config
from journal.features.workers.support.worker_repository import PROJECT_FOLDER, WorkerRepository
from journal.models.worker import Worker
from journal.support.listener_queue import ListenerQueue
from journal.support.rejection import Rejection
from journal.support.worktree_refs import TIPS_REF

GIT_TIMEOUT_SECONDS = 30


class WorkerBranch:
    """A worker's worktree and the branch it commits on: what it left there when it ended, and its commits taken into the branch the project is on. A project that holds repositories of its own inside it, ignored by its own, gives the worker a worktree of each of them inside its worktree, each on the worker's branch, and each is merged into its own repository."""

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

    def inner_folders(self) -> tuple[str, ...]:
        return tuple(sorted(child.name for child in self.config.root.iterdir() if child.is_dir() and (child / ".git").is_dir() and child.name != ".journal"))

    def repositories(self, worker: Worker) -> list[WorkerRepository]:
        folder = self.folder(worker)
        inner = [WorkerRepository(self.config.root / name, folder / name, Path(name)) for name in self.inner_folders() if (folder / name / ".git").is_file()]
        return [WorkerRepository(self.config.root, folder, PROJECT_FOLDER), *inner]

    def tip(self, repository: WorkerRepository, worker: Worker) -> str:
        head = self.git("rev-parse", "HEAD", cwd=repository.worktree) if repository.worktree.is_dir() else None
        return head.stdout.strip() if head is not None and head.returncode == 0 else self.name(worker)

    def touched(self, worker: Worker) -> tuple[str, ...] | None:
        if not worker.worktree:
            return None
        paths = [path for repository in self.repositories(worker) for path in self.repository_paths(repository, worker)]
        return tuple(dict.fromkeys(paths))

    def repository_paths(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        tip = self.tip(repository, worker)
        if self.git("rev-parse", "--verify", "-q", f"{tip}^{{commit}}", cwd=repository.checkout).returncode != 0:
            return []
        changed = self.git("diff", "--name-status", "-M", f"HEAD...{tip}", cwd=repository.checkout)
        return [repository.path(path) for line in changed.stdout.splitlines() for path in line.split("\t")[1:]] if changed.returncode == 0 else []

    def commits(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        finished = self.git("log", "--reverse", "--format=%h %s", f"HEAD..{self.tip(repository, worker)}", cwd=repository.checkout)
        return [line for line in finished.stdout.splitlines() if line.strip()] if finished.returncode == 0 else []

    def commit_count(self, worker: Worker) -> list[str]:
        return [commit for repository in self.repositories(worker) for commit in self.commits(repository, worker)]

    def remaining(self, worker: Worker) -> list[str]:
        if not self.folder(worker).is_dir():
            return []
        return [repository.path(line[3:]) for repository in self.repositories(worker) for line in self.git("status", "--short", cwd=repository.worktree).stdout.splitlines() if line.strip()]

    def merge(self, worker: Worker) -> str:
        return "; ".join(part for repository in self.repositories(worker) if (part := self.repository_merge(repository, worker)))

    def repository_merge(self, repository: WorkerRepository, worker: Worker) -> str:
        commits = self.commits(repository, worker)
        if not commits:
            return ""
        tip = self.tip(repository, worker)
        changed = self.git("diff", "--name-only", f"HEAD...{tip}", cwd=repository.checkout).stdout.split()
        place = f" of {repository.folder}" if repository.is_inner else ""
        listed = "; ".join(commits) + f" (files: {', '.join(changed[:20])}{', and more' if len(changed) > 20 else ''})"
        refusal = self.refusal(repository, worker)
        if refusal:
            return f"its {len(commits)} commits{place} were not taken in, since {refusal}: {listed}; take them in with git merge {tip}"
        return f"its {len(commits)} commits{place} were taken into this branch: {listed}"

    def merge_commit(self, worker: Worker) -> str:
        repositories = [repository for repository in self.repositories(worker) if self.commits(repository, worker)]
        for repository in repositories:
            blocked = self.blocked(repository, worker)
            if blocked:
                raise Rejection(f"worker {worker.id}'s work was not merged, since {blocked}; its proofs, its task and its worktree are as they were")
        return ", ".join(self.merged_commit(repository, worker) for repository in repositories)

    def merged_commit(self, repository: WorkerRepository, worker: Worker) -> str:
        refusal = self.refusal(repository, worker)
        if refusal:
            raise Rejection(f"worker {worker.id}'s work{f' in {repository.folder}' if repository.is_inner else ''} was not merged, since {refusal}; its proofs, its task and its worktree are as they were")
        head = self.git("rev-parse", "HEAD", cwd=repository.checkout).stdout.strip()[:9]
        return f"{repository.folder} {head}" if repository.is_inner else head

    def refusal(self, repository: WorkerRepository, worker: Worker) -> str:
        blocked = self.blocked(repository, worker)
        if blocked:
            return blocked
        clashing = self.rebased(repository, worker)
        if clashing:
            return f"rebased onto this branch there is a conflict in {clashing}"
        merged = self.git("merge", "--no-edit", self.tip(repository, worker), cwd=repository.checkout)
        if merged.returncode == 0:
            return ""
        clashing = self.conflicts(repository.checkout) or (merged.stderr.strip().splitlines() or ["git refused"])[-1]
        self.git("merge", "--abort", cwd=repository.checkout)
        return f"there is a conflict in {clashing}"

    def blocked(self, repository: WorkerRepository, worker: Worker) -> str:
        checkout = repository.checkout
        if self.git("symbolic-ref", "-q", "HEAD", cwd=checkout).returncode != 0:
            return f"{repository.folder if repository.is_inner else 'the project'} is on no branch, a detached head"
        if not self.git("config", "user.name", cwd=checkout).stdout.strip() or not self.git("config", "user.email", cwd=checkout).stdout.strip():
            return "git has no user.name and user.email here, which a merge needs"
        touched = set(self.git("diff", "--name-only", f"HEAD...{self.tip(repository, worker)}", cwd=checkout).stdout.split())
        dirty = {line[3:] for line in self.git("status", "--porcelain", cwd=checkout).stdout.splitlines() if line.strip()}
        overlap = sorted(repository.path(path) for path in touched & dirty)
        return f"you have uncommitted changes to files they change: {', '.join(overlap)}" if overlap else ""

    def rebased(self, repository: WorkerRepository, worker: Worker) -> str:
        tip = self.git("rev-parse", "HEAD", cwd=repository.checkout).stdout.strip()
        if self.git("merge-base", "--is-ancestor", tip, self.tip(repository, worker), cwd=repository.checkout).returncode == 0:
            return ""
        if self.git("rebase", "--autostash", tip, cwd=repository.worktree).returncode == 0:
            return ""
        clashing = self.conflicts(repository.worktree) or "its files"
        self.git("rebase", "--abort", cwd=repository.worktree)
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
        repositories = self.repositories(worker)
        for repository in repositories:
            self.git("update-ref", f"{TIPS_REF}/{folder.name}", self.tip(repository, worker), cwd=repository.checkout)
        self.removed(folder, self.name(worker), [repository.checkout for repository in repositories])
        return f"its worktree and branch are removed; its last commit is kept as {TIPS_REF}/{folder.name}"

    def removed(self, folder: Path, branch: str, checkouts: list[Path]) -> None:
        self.removed_root.mkdir(parents=True, exist_ok=True)
        folder.rename(self.removed_root / folder.name)
        self.deferred.add(lambda: self.cleared(branch, checkouts))

    def cleared(self, branch: str, checkouts: list[Path]) -> None:
        for checkout in checkouts:
            self.git("worktree", "prune", cwd=checkout)
            self.git("branch", "-D", branch, cwd=checkout)
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
