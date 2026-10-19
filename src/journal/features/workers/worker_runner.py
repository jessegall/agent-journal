import os
from pathlib import Path
import signal
import time
import subprocess
import threading

from journal.config import Config
from journal.features.workers.worker_branch import WorkerBranch
from journal.features.workers.worker_reports import WorkerReports
from journal.models.actor import Actor
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.scope import Scope
from journal.repositories.settings import Settings

TAIL = 4000


class WorkerRunner:
    """Runs a dispatched worker: its provider headless on the brief, in the project or in a worktree of its own, with the journal's hooks off; what it prints is its report, filed when it ends."""

    def __init__(self, config: Config, providers: Providers, reports: WorkerReports, scope: Scope, branch: WorkerBranch, settings: Settings) -> None:
        self.config, self.providers, self.reports, self.scope, self.branch, self.settings = config, providers, reports, scope, branch, settings
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
        began = time.time()
        try:
            process = subprocess.Popen(command, cwd=self.workplace(worker), env=environ, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
        except OSError as error:
            self.reports.file(worker, f"could not start: {error}", by)
            return
        self._running[worker.id] = process
        from journal.features.workers.feature import Workers
        limit = round(float(self.settings.option(Workers.TIMEOUT)) * 60) or None
        timed_out = False
        try:
            out, err = process.communicate(timeout=limit)
        except subprocess.TimeoutExpired:
            timed_out = True
            os.killpg(process.pid, signal.SIGKILL)
            out, err = process.communicate()
        self._running.pop(worker.id, None)
        provider = self.providers.named(worker.provider)
        printed, resume = provider.worker_outcome(out, err)
        resume = resume or provider.latest_session(self.place(worker), began)
        report = printed[-TAIL:] or "(nothing printed)"
        said = report if process.returncode == 0 else f"failed with code {process.returncode}: {report}"
        if timed_out:
            said = f"stopped after {limit // 60} minutes without ending: {report}"
        branch = self.branch.summary(worker)
        self.reports.file(worker.with_(resume=resume or worker.resume), f"{said}\n\n{branch}" if branch else said, by)

    def stop(self, worker_id: int) -> None:
        process = self._running.get(worker_id)
        if process:
            process.terminate()

    def place(self, worker: Worker) -> Path:
        """Where the worker works: the project root, or its own worktree."""
        return self.branch.folder(worker) if worker.worktree else self.config.root

    def workplace(self, worker: Worker) -> Path:
        """Where the worker works, its worktree made on a branch named for it the first time."""
        folder = self.place(worker)
        if worker.worktree and not folder.is_dir():
            subprocess.run(["git", "worktree", "add", "-q", "-b", self.branch.name(worker), str(folder)], cwd=self.config.root, capture_output=True, text=True, timeout=60)
        return folder
