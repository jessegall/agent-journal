import os
import subprocess
from pathlib import Path

from journal.config import Config
from journal.features.workers.support.worker_branch import CHECKOUT_TIMEOUT_SECONDS, WorkerBranch
from journal.models.worker import Worker
from journal.support.worktree_failure import WorktreeFailure

SHOWN_LINE_COUNT = 12


class WorktreeCommands:
    """The user's own commands around the making of a worker's worktree, one shell command per line, run in order in the folder given, each told where the worktree is, its branch, the project, the inner repositories and the library folders the dispatch named; the first that fails stops the making with what it printed."""

    def __init__(self, config: Config, branch: WorkerBranch) -> None:
        self.config, self.branch = config, branch

    def run(self, worker: Worker, lines: tuple[str, ...], folder: Path, names: tuple[str, ...]) -> None:
        for line in lines:
            self.line_run(worker, line, folder, names)

    def line_run(self, worker: Worker, line: str, folder: Path, names: tuple[str, ...]) -> None:
        try:
            outcome = subprocess.run(line, shell=True, cwd=folder, env=self.environment(worker, names), capture_output=True, text=True, timeout=CHECKOUT_TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired as error:
            raise WorktreeFailure(worker.name, f"`{line}` ran past {error.timeout:.0f} seconds") from error
        if outcome.returncode != 0:
            output_tail = "\n".join((outcome.stdout + outcome.stderr).strip().splitlines()[-SHOWN_LINE_COUNT:])
            raise WorktreeFailure(worker.name, f"`{line}` failed with code {outcome.returncode}: {output_tail}")

    def environment(self, worker: Worker, names: tuple[str, ...]) -> dict[str, str]:
        environment = os.environ.copy()
        environment.update(JOURNAL_WORKTREE=str(self.branch.folder(worker)), JOURNAL_BRANCH=self.branch.name(worker), JOURNAL_PROJECT=str(self.config.root), JOURNAL_REPOSITORIES=" ".join(names), JOURNAL_LIBRARIES=",".join(worker.library_links), JOURNAL_COPIES=",".join(worker.library_copies))
        return environment
