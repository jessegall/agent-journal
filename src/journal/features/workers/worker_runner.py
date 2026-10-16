import os
import subprocess
import threading

from journal.config import Config
from journal.features.workers.worker_reports import WorkerReports
from journal.models.actor import Actor
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.scope import Scope

TAIL = 4000


class WorkerRunner:
    """Runs a dispatched worker: its provider headless on the brief, in the project or in a worktree of its own, with the journal's hooks off; what it prints is its report, filed when it ends."""

    def __init__(self, config: Config, providers: Providers, reports: WorkerReports, scope: Scope) -> None:
        self.config, self.providers, self.reports, self.scope = config, providers, reports, scope
        self._running: dict[int, subprocess.Popen] = {}

    def start(self, worker: Worker, by: Actor) -> None:
        command = self.providers.named(worker.provider).worker_command(worker.brief, worker.model, worker.resume)
        threading.Thread(target=self.run_in_scope, args=(worker, command, by), name=f"worker-{worker.id}", daemon=True).start()

    def run_in_scope(self, worker: Worker, command: list[str], by: Actor) -> None:
        """The thread starts in no scope: the worker's report is filed in the worker's environment."""
        with self.scope.of(worker.environment_id):
            self.run(worker, command, by)

    def run(self, worker: Worker, command: list[str], by: Actor) -> None:
        """Blocks until the worker ends: for the thread above, and for a test that wants the outcome."""
        environ = {k: v for k, v in os.environ.items() if k not in ("AGENT_JOURNAL_ACTIVE", "JOURNAL_ENV", "JOURNAL_SESSION")}
        try:
            process = subprocess.Popen(command, cwd=self.workplace(worker), env=environ, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        except OSError as error:
            self.reports.file(worker, f"could not start: {error}", by)
            return
        self._running[worker.id] = process
        out, err = process.communicate()
        self._running.pop(worker.id, None)
        printed, resume = self.providers.named(worker.provider).worker_outcome(out, err)
        report = printed[-TAIL:] or "(nothing printed)"
        self.reports.file(worker.with_(resume=resume or worker.resume), report if process.returncode == 0 else f"failed with code {process.returncode}: {report}", by)

    def stop(self, worker_id: int) -> None:
        process = self._running.get(worker_id)
        if process:
            process.terminate()

    def workplace(self, worker: Worker) -> str:
        """The project root, or a worktree of its own on a branch named for the worker."""
        if not worker.worktree:
            return str(self.config.root)
        folder = self.config.home / "worktrees" / f"{worker.id}-{worker.name}".replace(" ", "-")
        if not folder.is_dir():
            subprocess.run(["git", "worktree", "add", "-q", "-b", f"worker/{worker.id}-{worker.name}".replace(" ", "-"), str(folder)], cwd=self.config.root, capture_output=True, text=True, timeout=60)
        return str(folder)
