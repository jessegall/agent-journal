import re
import shutil
import subprocess
from pathlib import Path

from journal.config import Config
from journal.features.workers.support.worker_repository import PROJECT_FOLDER, WorkerRepository
from journal.models.worker import Worker
from journal.support.listener_queue import ListenerQueue
from journal.support.rejection import Rejection
from journal.support.worktree_refs import TIPS_REF
from journal.support.worktree import Worktree
from journal.repositories.environments import Environments
from journal.sync.team_account import TeamAccount

GIT_TIMEOUT_SECONDS = 30
CHECKOUT_TIMEOUT_SECONDS = 600


class WorkerBranch:
    """A worker's worktree and the branch it commits on: what it left there when it ended, and its commits taken into the branch the project is on, which on a shared journal is the branch of the worker's environment's own worktree, never the main checkout's. A project that holds repositories of its own inside it, ignored by its own, gives the worker a worktree of each one recorded on its row, inside its worktree and on the worker's branch; its commits are taken in from every repository or from none."""

    def __init__(self, config: Config, deferred: ListenerQueue, account: TeamAccount, environments: Environments) -> None:
        self.config, self.deferred, self.account, self.environments = config, deferred, account, environments
        self.removed_root = config.home / "removed-worktrees"

    def name(self, worker: Worker) -> str:
        return f"worker/{worker.id}-{worker.name}".replace(" ", "-")

    def folder(self, worker: Worker) -> Path:
        return self.config.home / "worktrees" / f"{worker.id}-{worker.name}".replace(" ", "-")

    def place(self, worker: Worker) -> Path:
        return self.folder(worker) if worker.worktree else self.checkout(worker)

    def checkout(self, worker: Worker) -> Path:
        if not self.account.is_joined():
            return self.config.root
        environment_worktree = Worktree(self.config.root, self.environments.find(worker.environment_id).name).path
        return environment_worktree if environment_worktree.is_dir() else self.config.root

    def git(self, *argv: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd or self.config.root, capture_output=True, text=True, timeout=GIT_TIMEOUT_SECONDS)

    def checkout_git(self, *argv: str, cwd: Path) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=CHECKOUT_TIMEOUT_SECONDS)

    def inner_folders(self) -> tuple[str, ...]:
        return tuple(sorted(child.name for child in self.config.root.iterdir() if self.is_inner_repository(child)))

    def is_inner_repository(self, child: Path) -> bool:
        if not child.is_dir() or child.is_symlink() or not (child / ".git").exists() or child.resolve() == self.config.home.resolve():
            return False
        if self.git("check-ignore", "-q", child.name).returncode != 0:
            return False
        top = self.git("rev-parse", "--show-toplevel", cwd=child)
        return top.returncode == 0 and Path(top.stdout.strip()).resolve() == child.resolve()

    def brief_folders(self, brief: str) -> tuple[str, ...]:
        return tuple(name for name in self.inner_folders() if re.search(rf"(?<![\w-]){re.escape(name)}(?![\w-])", brief, re.IGNORECASE))

    def repositories(self, worker: Worker) -> list[WorkerRepository]:
        folder = self.folder(worker)
        inner = [WorkerRepository(self.config.root / name, folder / name, Path(name)) for name in worker.repositories]
        return [WorkerRepository(self.checkout(worker), folder, PROJECT_FOLDER), *inner]

    def tip(self, repository: WorkerRepository, worker: Worker) -> str:
        head = self.git("rev-parse", "HEAD", cwd=repository.worktree) if repository.is_present else None
        return head.stdout.strip() if head is not None and head.returncode == 0 else self.name(worker)

    def is_commit(self, repository: WorkerRepository, tip: str) -> bool:
        return self.git("rev-parse", "--verify", "-q", f"{tip}^{{commit}}", cwd=repository.checkout).returncode == 0

    def touched(self, worker: Worker) -> tuple[str, ...] | None:
        if not worker.worktree:
            return None
        commit_repositories = [repository for repository in self.repositories(worker) if self.is_commit(repository, self.tip(repository, worker))]
        if not commit_repositories:
            return None
        return tuple(dict.fromkeys(path for repository in commit_repositories for path in self.repository_paths(repository, worker)))

    def repository_paths(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        changed = self.git("diff", "--name-status", "-M", f"HEAD...{self.tip(repository, worker)}", cwd=repository.checkout)
        return [repository.path(path) for line in changed.stdout.splitlines() for path in line.split("\t")[1:]] if changed.returncode == 0 else []

    def commits(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        tip = self.tip(repository, worker)
        if not self.is_commit(repository, tip):
            return []
        finished = self.git("log", "--reverse", "--format=%h %s", f"HEAD..{tip}", cwd=repository.checkout)
        if finished.returncode != 0:
            raise Rejection(f"git could not list worker {worker.id}'s commits in {repository.label()}: {(finished.stderr.strip().splitlines() or ['no reason given'])[-1]}")
        return [line for line in finished.stdout.splitlines() if line.strip()]

    def pending(self, worker: Worker) -> list[WorkerRepository]:
        return [repository for repository in self.repositories(worker) if self.commits(repository, worker)]

    def remaining(self, worker: Worker) -> list[str]:
        folder = self.folder(worker)
        if not folder.is_dir():
            return []
        files = [repository.path(file) for repository in self.repositories(worker) if repository.is_present for file in self.status_files(repository.worktree)]
        strays = [f"{name}/" for name in self.inner_folders() if name not in worker.repositories and (folder / name).exists()]
        return files + strays

    def status_files(self, folder: Path) -> list[str]:
        entries = iter(self.git("status", "--porcelain=v1", "-z", cwd=folder).stdout.split("\0"))
        files = []
        for entry in filter(None, entries):
            files.append(entry[3:])
            if entry[0] in "RC":
                next(entries, "")
        return files

    def merge(self, worker: Worker) -> str:
        pending = self.pending(worker)
        if not pending:
            return ""
        listings = [(self.heading(repository, worker), self.listing(repository, worker)) for repository in pending]
        refusal = self.refusal(pending, worker)
        if refusal:
            listed = "; ".join(f"{heading}: {listing}" for heading, listing in listings)
            return f"its commits were not taken in, since {refusal}: {listed}; take them in with git merge {self.name(worker)} in each repository"
        return "; ".join(f"{heading} were taken into this branch: {listing}" for heading, listing in listings)

    def heading(self, repository: WorkerRepository, worker: Worker) -> str:
        return f"its {len(self.commits(repository, worker))} commits" + (f" in {repository.folder}" if repository.is_inner else "")

    def listing(self, repository: WorkerRepository, worker: Worker) -> str:
        changed = self.git("diff", "--name-only", f"HEAD...{self.tip(repository, worker)}", cwd=repository.checkout).stdout.split()
        return "; ".join(self.commits(repository, worker)) + f" (files: {', '.join(changed[:20])}{', and more' if len(changed) > 20 else ''})"

    def merge_commit(self, worker: Worker) -> str:
        pending = self.pending(worker)
        refusal = self.refusal(pending, worker)
        if refusal:
            raise Rejection(f"worker {worker.id}'s work was not merged, since {refusal}; its proofs and its task are as they were")
        return ", ".join(self.head(repository) for repository in pending)

    def head(self, repository: WorkerRepository) -> str:
        head = self.git("rev-parse", "HEAD", cwd=repository.checkout).stdout.strip()[:9]
        return f"{repository.folder} {head}" if repository.is_inner else head

    def refusal(self, pending: list[WorkerRepository], worker: Worker) -> str:
        blocked = [reason for repository in pending if (reason := self.blocked(repository, worker))]
        if blocked:
            return blocked[0]
        for repository in pending:
            clashing = self.rebased(repository, worker)
            if clashing:
                return f"rebased onto the branch of {repository.label()} there is a conflict in {clashing}"
        merges = []
        for repository in pending:
            clashing = self.merged(repository, worker)
            if clashing:
                note = f"; {', '.join(merge.label() for merge in merges)} took its commits in already" if merges else ""
                return f"there is a conflict in {clashing}{note}"
            merges.append(repository)
        return ""

    def blocked(self, repository: WorkerRepository, worker: Worker) -> str:
        checkout = repository.checkout
        if self.git("symbolic-ref", "-q", "HEAD", cwd=checkout).returncode != 0:
            return f"{repository.label()} is on no branch, a detached head"
        if not self.git("config", "user.name", cwd=checkout).stdout.strip() or not self.git("config", "user.email", cwd=checkout).stdout.strip():
            return f"git has no user.name and user.email in {repository.label()}, which a merge needs"
        touched = set(self.git("diff", "--name-only", f"HEAD...{self.tip(repository, worker)}", cwd=checkout).stdout.split())
        overlap = sorted(repository.path(path) for path in touched & set(self.status_files(checkout)))
        return f"you have uncommitted changes to files they change: {', '.join(overlap)}" if overlap else ""

    def rebased(self, repository: WorkerRepository, worker: Worker) -> str:
        head = self.git("rev-parse", "HEAD", cwd=repository.checkout).stdout.strip()
        if self.git("merge-base", "--is-ancestor", head, self.tip(repository, worker), cwd=repository.checkout).returncode == 0:
            return ""
        if not repository.is_present:
            return f"{repository.label()}, whose worktree is gone, so its commits cannot be rebased"
        if self.git("rebase", "--autostash", head, cwd=repository.worktree).returncode == 0:
            return ""
        clashing = self.conflicts(repository.worktree)
        self.git("rebase", "--abort", cwd=repository.worktree)
        return ", ".join(repository.path(path) for path in clashing.split(", ")) if clashing else f"the files of {repository.label()}"

    def merged(self, repository: WorkerRepository, worker: Worker) -> str:
        merged = self.git("merge", "--no-edit", self.tip(repository, worker), cwd=repository.checkout)
        if merged.returncode == 0:
            return ""
        clashing = self.conflicts(repository.checkout) or (merged.stderr.strip().splitlines() or ["git refused"])[-1]
        self.git("merge", "--abort", cwd=repository.checkout)
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
            tip = self.tip(repository, worker)
            if self.is_commit(repository, tip):
                self.git("update-ref", f"{TIPS_REF}/{folder.name}", tip, cwd=repository.checkout)
        self.removed(folder, self.name(worker), [repository.checkout for repository in repositories])
        return f"its worktree and branch are removed; its last commit is kept as {TIPS_REF}/{folder.name}"

    def removed(self, folder: Path, branch: str, checkouts: list[Path]) -> None:
        self.removed_root.mkdir(parents=True, exist_ok=True)
        folder.rename(self.removed_root / folder.name)
        self.deferred.add(lambda: self.cleared(branch, checkouts))

    def cleared(self, branch: str, checkouts: list[Path]) -> None:
        self.pruned(branch, checkouts)
        for folder in self.removed_root.iterdir():
            shutil.rmtree(folder)

    def pruned(self, branch: str, checkouts: list[Path]) -> None:
        for checkout in checkouts:
            self.git("worktree", "prune", cwd=checkout)
            self.git("branch", "-D", branch, cwd=checkout)

    def discarded(self, worker: Worker, names: tuple[str, ...]) -> None:
        folder = self.folder(worker)
        if folder.is_dir():
            shutil.rmtree(folder)
        self.pruned(self.name(worker), [self.config.root / name for name in names] + [self.checkout(worker)])

    def summary(self, worker: Worker) -> str:
        if not worker.worktree:
            return ""
        parts = [part for part in (self.merge(worker), self.leftover(worker)) if part]
        return ". ".join(parts)

    def leftover(self, worker: Worker) -> str:
        files = self.remaining(worker)
        return f"it left {len(files)} files uncommitted in its worktree {self.folder(worker)}: {', '.join(files[:10])}" if files else ""
