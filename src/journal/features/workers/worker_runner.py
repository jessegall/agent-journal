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
from journal.repositories.workers import Workers

TAIL = 4000
WATCH_EVERY = 2.0
"""Seconds between two looks at a worker found running at boot."""
TIMED_OUT = -1
ENDED_UNSEEN = -2
"""How a run ended that the journal did not see end, as a worker found running at boot."""
ENDINGS = {TIMED_OUT: "stopped after {minutes:g} minutes without ending: {report}", ENDED_UNSEEN: "{report}"}


class WorkerRunner:
    """Runs a dispatched worker: its provider headless on the brief, in the project or in a worktree of its own, with the journal's hooks off; what it prints is its report, filed when it ends."""

    def __init__(self, config: Config, providers: Providers, reports: WorkerReports, scope: Scope, branch: WorkerBranch, settings: Settings, workers: Workers) -> None:
        self.config, self.providers, self.reports, self.scope, self.branch, self.settings, self.workers = config, providers, reports, scope, branch, settings, workers
        self._running: dict[int, subprocess.Popen] = {}

    def start(self, worker: Worker, by: Actor) -> None:
        command = self.providers.named(worker.provider).worker_command(worker.brief, worker.model, worker.resume)
        threading.Thread(target=self.run_in_scope, args=(worker, command, by), name=f"worker-{worker.id}", daemon=True).start()

    def run_in_scope(self, worker: Worker, command: list[str], by: Actor) -> None:
        """The thread starts in no scope: the worker's report is filed in the worker's environment."""
        with self.scope.of(worker.environment_id):
            self.run(worker, command, by)

    def run(self, worker: Worker, command: list[str], by: Actor) -> None:
        """Blocks until the worker ends: for the thread above, and for a test that wants the outcome. Its output goes to files, not to the journal, so the worker outlives a restart of the journal and is watched again at boot."""
        environ = {k: v for k, v in os.environ.items() if k not in ("AGENT_JOURNAL_ACTIVE", "JOURNAL_ENV", "JOURNAL_SESSION")}
        out, err = self.outputs(worker)
        out.parent.mkdir(parents=True, exist_ok=True)
        try:
            with out.open("w") as printed, err.open("w") as faults:
                process = subprocess.Popen(command, cwd=self.workplace(worker), env=environ, stdin=subprocess.DEVNULL, stdout=printed, stderr=faults, text=True, start_new_session=True)
        except OSError as error:
            self.reports.file(worker, f"could not start: {error}", by)
            return
        worker = self.workers.save(worker.running_as(process.pid, time.time()), by)
        self._running[worker.id] = process
        try:
            code = process.wait(timeout=self.limit_left(worker))
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()
            code = TIMED_OUT
        self._running.pop(worker.id, None)
        self.finish(worker, code, by)

    def watch(self, worker: Worker, by: Actor) -> None:
        """A worker found still running at boot, its process started by a journal before this one: waited on until its process ends, then its report filed from its files."""
        while self.alive(worker.pid):
            if self.limit_left(worker) == 0:
                os.killpg(worker.pid, signal.SIGKILL)
                self.finish(worker, TIMED_OUT, by)
                return
            time.sleep(WATCH_EVERY)
        self.finish(worker, ENDED_UNSEEN, by)

    def finish(self, worker: Worker, code: int, by: Actor) -> None:
        """The report filed from what the worker printed: its answer, how it ended, and its branch."""
        out, err = self.outputs(worker)
        provider = self.providers.named(worker.provider)
        printed, resume = provider.worker_outcome(self.read(out), self.read(err))
        resume = resume or provider.latest_session(self.place(worker), worker.began)
        report = printed[-TAIL:] or "(nothing printed)"
        said = ENDINGS.get(code, f"failed with code {code}: {{report}}").format(report=report, minutes=self.minutes()) if code else report
        branch = self.branch.summary(worker)
        self.reports.file(worker.with_(resume=resume or worker.resume), f"{said}\n\n{branch}" if branch else said, by)

    def limit_left(self, worker: Worker) -> float | None:
        """Seconds the worker may still run under the time limit; none without one."""
        limit = self.minutes() * 60
        return max(0.0, limit - (time.time() - worker.began)) if limit else None

    def minutes(self) -> float:
        from journal.features.workers.feature import Workers
        return float(self.settings.option(Workers.TIMEOUT))

    def outputs(self, worker: Worker) -> tuple[Path, Path]:
        """The files the worker's run prints to, what it answers and what it complains of."""
        folder = self.config.home / "runtime" / "workers"
        return folder / f"{worker.id}.out", folder / f"{worker.id}.err"

    @staticmethod
    def read(path: Path) -> str:
        return path.read_text(errors="replace") if path.is_file() else ""

    @staticmethod
    def alive(pid: int) -> bool:
        if pid <= 0:
            return False
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return False
        except PermissionError:
            return True
        return True

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
