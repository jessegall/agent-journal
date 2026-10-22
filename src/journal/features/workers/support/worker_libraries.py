import subprocess
import sys
from pathlib import Path

from journal.config import Config
from journal.features.workers.support.worker_branch import CHECKOUT_TIMEOUT_SECONDS, WorkerBranch
from journal.features.workers.support.worker_repository import WorkerRepository
from journal.models.worker import Worker
from journal.support.worktree import Worktree
from journal.support.worktree_failure import WorktreeFailure

COPY_COMMANDS = {"darwin": ("cp", "-cR"), "linux": ("cp", "-a", "--reflink=auto")}
FORBIDDEN_PARTS = (".git", ".journal", "..")


class WorkerLibraries:
    """The library folders a worker's worktree takes from the main checkout, named at its dispatch: each one linked, or copied as a clone that shares the checkout's disk blocks until written, in the project's worktree and in each inner repository's worktree where the checkout holds the folder, and kept out of git there."""

    def __init__(self, config: Config, branch: WorkerBranch) -> None:
        self.config, self.branch = config, branch

    def refusal(self, names: tuple[str, ...]) -> str:
        for name in names:
            path = Path(name)
            if path.is_absolute() or any(part in FORBIDDEN_PARTS for part in path.parts):
                return f"{name} is no library folder: name a folder inside the project, such as vendor or web/node_modules"
            checkouts = [checkout for checkout in self.checkouts() if (checkout / path).is_dir()]
            if not checkouts:
                return f"no checkout holds a folder {name}: name the library folders the project has, such as vendor or node_modules"
            tracked = [checkout for checkout in checkouts if self.branch.git("check-ignore", "-q", name, cwd=checkout).returncode != 0]
            if tracked:
                return f"{name} in {tracked[0]} is not ignored by git, so the worktree has it already; leave it out"
        return ""

    def checkouts(self) -> list[Path]:
        return [self.config.root, *(self.config.root / name for name in self.branch.inner_folders())]

    def placed(self, worker: Worker) -> None:
        for repository in self.branch.repositories(worker):
            if repository.is_present:
                self.repository_placed(repository, worker)

    def repository_placed(self, repository: WorkerRepository, worker: Worker) -> None:
        names = [name for name in (*worker.library_links, *worker.library_copies) if (repository.checkout / name).is_dir()]
        if names:
            Worktree(repository.checkout, repository.worktree.name).excluded([Path(name) for name in names])
        for name in worker.library_links:
            if (repository.checkout / name).is_dir():
                Worktree.linked(repository.worktree / name, repository.checkout / name)
        for name in worker.library_copies:
            if (repository.checkout / name).is_dir() and not (repository.worktree / name).exists():
                self.copied(repository.checkout / name, repository.worktree / name, worker)

    def copied(self, source: Path, target: Path, worker: Worker) -> None:
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            outcome = subprocess.run([*COPY_COMMANDS.get(sys.platform, ("cp", "-R")), str(source), str(target)], capture_output=True, text=True, timeout=CHECKOUT_TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired as expired:
            raise WorktreeFailure(worker.name, f"copying {source} took longer than {expired.timeout:.0f} seconds") from expired
        if outcome.returncode != 0:
            raise WorktreeFailure(worker.name, f"copying {source}: {outcome.stderr.strip()}")

    def note(self, worker: Worker) -> str:
        if not worker.library_links and not worker.library_copies:
            return ""
        lines = ["Library folders in your worktree:"]
        if worker.library_links:
            names = ", ".join(worker.library_links)
            lines.append(f"- {names}: links to the main checkout's folders. Installing or updating through them changes the main checkout for everyone. To change a dependency, remove the link first with `rm <folder>`, with no trailing slash, then install your own.")
        if worker.library_copies:
            lines.append(f"- {', '.join(worker.library_copies)}: copies of your own, which you may change.")
        lines.append("A test or tool run in a container that mounts the main checkout tests the main checkout, not your worktree.")
        return "\n".join(lines)
