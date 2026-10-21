import os
from pathlib import Path
import signal
import time
import subprocess
import threading

from journal.config import Config
from journal.support.caller import AGENT_SHELL
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_reports import WorkerReports
from journal.support.actor import Actor
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.providers.providers import Providers
from journal.support.profile_files import ProfileFiles
from journal.support.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.workers import Workers
from journal.repositories.environments import Environments
from journal.support.worktree_failure import WorktreeFailure

TAIL = 4000
TIMEOUT_STATUS = -1
END_UNWATCHED = -2
ENDINGS = {TIMEOUT_STATUS: "stopped after {minutes:g} minutes without ending: {report}", END_UNWATCHED: "{report}"}
EXCLUDED_VARIABLES = ("AGENT_JOURNAL_ACTIVE", "JOURNAL_SESSION", "CLAUDE_CODE_SHELL_PREFIX")


class WorkerRunner:
    """Runs a dispatched worker: its provider headless on the brief, in the project or in a worktree of its own, with the journal's hooks off; what it prints is its report, filed when it ends."""

    def __init__(self, config: Config, providers: Providers, reports: WorkerReports, scope: Scope, branch: WorkerBranch, settings: SettingRows, workers: Workers, environments: Environments, profiles: ProfileFiles) -> None:
        self.config, self.providers, self.reports, self.scope, self.branch, self.settings, self.workers = config, providers, reports, scope, branch, settings, workers
        self.environments, self.profiles = environments, profiles
        self._running: dict[int, subprocess.Popen] = {}

    def start(self, worker: Worker, actor: Actor) -> None:
        command = self.providers.lookup(worker.provider).worker_command(self.instructed(worker), worker.model, worker.resume)
        threading.Thread(target=self.run_scoped, args=(worker, command, actor), name=f"worker-{worker.id}", daemon=True).start()

    def instructed(self, worker: Worker) -> str:
        if worker.resume or worker.profile is None:
            return worker.brief
        return f"{self.profiles.read(worker.profile)['body']}\n\n{worker.brief}"

    def run_scoped(self, worker: Worker, command: list[str], actor: Actor) -> None:
        with self.scope.environment(worker.environment_id):
            self.run(worker, command, actor)

    def run(self, worker: Worker, command: list[str], actor: Actor) -> None:
        environ = {**{k: v for k, v in os.environ.items() if k not in EXCLUDED_VARIABLES}, AGENT_SHELL: "1", "JOURNAL_ACTOR": "worker-agent", "JOURNAL_ENV": self.environments.find(worker.environment_id).name}
        output, err = self.outputs(worker)
        output.parent.mkdir(parents=True, exist_ok=True)
        try:
            with output.open("w") as output_text, err.open("w") as faults:
                process = subprocess.Popen(command, cwd=self.workplace(worker), env=environ, stdin=subprocess.DEVNULL, stdout=output_text, stderr=faults, text=True, start_new_session=True)
        except OSError as error:
            self.reports.file(worker, f"could not start: {error}", actor)
            return
        worker = self.workers.save(worker.running_as(process.pid, time.time()), actor)
        self._running[worker.id] = process
        try:
            code = process.wait(timeout=self.remaining_minutes(worker))
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()
            code = TIMEOUT_STATUS
        self._running.pop(worker.id, None)
        self.finish(worker, code, actor)

    def is_finished(self, worker: Worker, actor: Actor) -> bool:
        if not self.is_running(worker.pid):
            self.finish(worker, END_UNWATCHED, actor)
            return True
        if self.remaining_minutes(worker) == 0:
            os.killpg(worker.pid, signal.SIGKILL)
            self.finish(worker, TIMEOUT_STATUS, actor)
            return True
        return False

    def finish(self, worker: Worker, code: int, actor: Actor) -> None:
        output, err = self.outputs(worker)
        provider = self.providers.lookup(worker.provider)
        output_text, resume = provider.worker_outcome(self.read(output), self.read(err))
        resume = resume or provider.latest_session(self.place(worker), worker.began)
        report = output_text[-TAIL:] or "(nothing printed)"
        outcome = ENDINGS.get(code, f"failed with code {code}: {{report}}").format(report=report, minutes=self.minutes()) if code else report
        current = self.workers.find(worker.id).with_(resume=resume or worker.resume)
        if current.state == WorkerState.REPORTED:
            self.workers.save(current, actor)
            return
        branch = self.branch.summary(current)
        self.reports.file(current, f"{outcome}\n\n{branch}" if branch else outcome, actor)

    def remaining_minutes(self, worker: Worker) -> float | None:
        limit = self.minutes() * 60
        return max(0.0, limit - (time.time() - worker.began)) if limit else None

    def minutes(self) -> float:
        from journal.features.workers.feature import Workers
        return float(self.settings.option(Workers.TIMEOUT))

    def outputs(self, worker: Worker) -> tuple[Path, Path]:
        folder = self.config.home / "runtime" / "workers"
        return folder / f"{worker.id}.out", folder / f"{worker.id}.err"

    @staticmethod
    def read(path: Path) -> str:
        return path.read_text(errors="replace") if path.is_file() else ""

    @staticmethod
    def is_running(pid: int) -> bool:
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
        return self.branch.folder(worker) if worker.worktree else self.config.root

    def workplace(self, worker: Worker) -> Path:
        folder = self.place(worker)
        if worker.worktree and not folder.is_dir():
            self.cut(worker, folder)
        return folder

    def cut(self, worker: Worker, folder: Path) -> None:
        if subprocess.run(["git", "rev-parse", "--verify", "-q", "HEAD"], cwd=self.config.root, capture_output=True, timeout=60).returncode != 0:
            raise WorktreeFailure(worker.name, "the project has no commit yet, so there is no tip to cut a worktree from; make a first commit")
        added = subprocess.run(["git", "worktree", "add", "-q", "-b", self.branch.name(worker), str(folder), "HEAD"], cwd=self.config.root, capture_output=True, text=True, timeout=60)
        if added.returncode != 0:
            subprocess.run(["git", "worktree", "prune"], cwd=self.config.root, capture_output=True, timeout=60)
            raise WorktreeFailure(worker.name, added.stderr.strip())
