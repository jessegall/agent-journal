from typing import Callable
import json
import os
from pathlib import Path
import signal
import time
import subprocess
import threading

from journal.config import Config
from journal.support.caller import ACTOR, AGENT_SHELL, WORKER, WORKER_ACTOR, WORKER_TOKEN
from journal.support.worker_token import WorkerToken
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_chat import WorkerChat
from journal.features.workers.support.worker_reports import WorkerReports
from journal.support.actor import Actor
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.providers.providers import Providers
from journal.features.profiles.support.profile_files import ProfileFiles
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.agents import Agents
from journal.repositories.workers import Workers
from journal.repositories.environments import Environments
from journal.support.worktree import Worktree
from journal.features.workers.support.worker_libraries import WorkerLibraries
from journal.features.workers.support.worktree_commands import WorktreeCommands
from journal.support.worktree_failure import WorktreeFailure
from journal.support.process_check import ProcessCheck

REPORT_CHARACTERS = 12000
REPORT_END_CHARACTERS = 3000
SESSION_POLL_SECONDS = 0.5
TIMEOUT_STATUS = -1
END_UNWATCHED = -2
ERROR_STATUS = -3
ENDINGS = {TIMEOUT_STATUS: "stopped after {minutes:g} minutes without ending: {report}", END_UNWATCHED: "{report}", ERROR_STATUS: "failed: {report}"}
JOURNAL_ACTIVE = "AGENT_JOURNAL_ACTIVE"
EXCLUDED_VARIABLES = ("JOURNAL_SESSION", "JOURNAL_LAUNCH")


class WorkerRunner:
    """Runs a dispatched worker: its provider headless on the brief, in the project or in a worktree of its own, with the journal's hooks off; what it prints is its report, filed when it ends."""

    def __init__(self, config: Config, providers: Providers, reports: WorkerReports, scope: Scope, branch: WorkerBranch, settings: SettingRows, workers: Workers, environments: Environments, profiles: ProfileFiles, agents: Agents, chat: WorkerChat, libraries: WorkerLibraries, commands: WorktreeCommands) -> None:
        self.config, self.providers, self.reports, self.scope, self.branch, self.settings, self.workers = config, providers, reports, scope, branch, settings, workers
        self.environments, self.profiles, self.agents, self.chat, self.libraries, self.commands = environments, profiles, agents, chat, libraries, commands
        self._locks: dict[int, threading.Lock] = {}
        self._locks_lock = threading.Lock()

    def lock(self, worker_id: int) -> threading.Lock:
        with self._locks_lock:
            return self._locks.setdefault(worker_id, threading.Lock())

    def start(self, worker: Worker, actor: Actor) -> None:
        provider = self.providers.lookup(worker.provider)
        worker = self.workers.save(worker.with_(session=provider.worker_session(worker.resume)), actor)
        command = [*provider.worker_command(self.instructed(worker), worker.model, worker.resume, worker.session), *provider.worker_settings_flags(self.hook_settings(worker))]
        threading.Thread(target=self.run_scoped, args=(worker, command, actor), name=f"worker-{worker.id}", daemon=True).start()

    def hook_settings(self, worker: Worker) -> Path:
        provider, folder = self.providers.lookup(worker.provider), self.branch.place(worker)
        path = provider.worker_hook_file(folder, self.outputs(worker)[0].with_suffix(".settings.json"))
        if not path.exists():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps({"hooks": provider.hook_block(provider.hook_command(self.config.root))}, indent=2) + "\n")
        if worker.worktree and path.is_relative_to(folder):
            Worktree(self.config.root, folder.name).excluded([path.relative_to(folder)])
        return path

    def instructed(self, worker: Worker) -> str:
        if worker.resume or worker.profile is None:
            return worker.brief
        return "\n\n".join(part for part in (self.profiles.worker_instructions(worker.profile), self.libraries.note(worker), worker.brief) if part)

    def run_scoped(self, worker: Worker, command: list[str], actor: Actor) -> None:
        with self.scope.environment(worker.environment_id):
            self.run(worker, command, actor)

    def run(self, worker: Worker, command: list[str], actor: Actor) -> None:
        token = WorkerToken.random()
        worker = self.workers.save(worker.with_(token_hash=token.digest()), actor)
        environ = {**self.environment_variables(self.environments.find(worker.environment_id).name), WORKER: str(worker.id), WORKER_TOKEN: token.text}
        output, err = self.outputs(worker)
        output.parent.mkdir(parents=True, exist_ok=True)
        try:
            with output.open("w") as output_text, err.open("w") as faults:
                process = subprocess.Popen(command, cwd=self.branch.place(worker), env=environ, stdin=subprocess.DEVNULL, stdout=output_text, stderr=faults, text=True, start_new_session=True)
        except OSError as error:
            self.reports.file(worker, f"could not start: {error}", actor)
            return
        worker = self.workers.save(worker.running_as(process.pid, time.time()), actor)
        self.finish(worker, self.waited(worker, process, actor), actor)

    def environment_variables(self, environment: str) -> dict[str, str]:
        excluded = (*EXCLUDED_VARIABLES, *self.providers.inherited_markers(), *self.providers.session_variables())
        return {**{k: v for k, v in os.environ.items() if k not in excluded}, AGENT_SHELL: "1", JOURNAL_ACTIVE: "1", ACTOR: WORKER_ACTOR, "JOURNAL_ENV": environment, "JOURNAL_ROOT": str(self.config.root)}
    def waited(self, worker: Worker, process: subprocess.Popen, actor: Actor) -> int:
        while True:
            try:
                return process.wait(timeout=self.wait_step(worker))
            except subprocess.TimeoutExpired:
                if self.remaining_seconds(worker) == 0:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
                    return TIMEOUT_STATUS
                worker = self.session_recorded(worker, actor)

    def wait_step(self, worker: Worker) -> float | None:
        remaining = self.remaining_seconds(worker)
        if worker.resume:
            return remaining
        return SESSION_POLL_SECONDS if remaining is None else min(remaining, SESSION_POLL_SECONDS)

    def session_recorded(self, worker: Worker, actor: Actor) -> Worker:
        output, err = self.outputs(worker)
        session = self.providers.lookup(worker.provider).output_session(self.read(output), self.read(err))
        return self.workers.touch(worker, actor, resume=session) if session else worker

    def is_finished(self, worker: Worker, actor: Actor) -> bool:
        if not self.is_running(worker.pid):
            self.recorded_end(worker, actor)
            return True
        if self.remaining_seconds(worker) == 0:
            os.killpg(worker.pid, signal.SIGKILL)
            self.finish(worker, TIMEOUT_STATUS, actor)
            return True
        return False

    def is_ended(self, worker: Worker) -> bool:
        return worker.is_running() and worker.pid > 0 and not self.is_running(worker.pid)

    def recorded_end(self, worker: Worker, actor: Actor) -> Worker:
        self.finish(worker, END_UNWATCHED, actor)
        return self.workers.find(worker.row_id)

    def finish(self, worker: Worker, code: int, actor: Actor) -> None:
        self.session_ended(worker)
        self.chat.read(self.workers.find(worker.row_id))
        output, err = self.outputs(worker)
        provider = self.providers.lookup(worker.provider)
        ended = provider.worker_outcome(self.read(output), self.read(err))
        resume = ended.session or self.latest_session(worker)
        report = self.shortened_report(ended.error or ended.report) or "(nothing printed)"
        code = code or (ERROR_STATUS if ended.error else 0)
        outcome = ENDINGS.get(code, f"failed with code {code}: {{report}}").format(report=report, minutes=self.minutes()) if code else report
        current = self.workers.find(worker.row_id)
        current = current.with_(resume=resume or current.resume)
        if current.token_hash and current.is_running():
            self.workers.save(current.unfinished(time.time(), outcome), actor)
            return
        if current.state != WorkerState.DISPATCHED:
            self.workers.save(current, actor)
            return
        current = current.with_(touched_paths=self.branch.touched(current))
        branch = self.branch.summary(current)
        self.reports.file(current, f"{outcome}\n\n{branch}" if branch else outcome, actor)

    def session_ended(self, worker: Worker) -> None:
        unended = self.agents.active_session_agents(worker.session)
        for agent in unended:
            self.agents.save(agent.retired(time.time()), Actor.system())

    @staticmethod
    def shortened_report(text: str) -> str:
        if len(text) <= REPORT_CHARACTERS:
            return text
        start, end = text[:REPORT_CHARACTERS - REPORT_END_CHARACTERS], text[-REPORT_END_CHARACTERS:]
        return f"{start}\n\n... {len(text) - len(start) - len(end):,} characters left out ...\n\n{end}"

    def latest_session(self, worker: Worker) -> str:
        return self.providers.lookup(worker.provider).latest_session(self.branch.place(worker), worker.began) if worker.worktree and worker.began else ""

    def remaining_seconds(self, worker: Worker) -> float | None:
        limit = self.minutes() * 60
        return max(0.0, limit - (time.time() - worker.began)) if limit else None

    def minutes(self) -> float:
        from journal.features.workers.feature import Workers
        return self.settings.decimal(Workers.TIMEOUT)

    def outputs(self, worker: Worker) -> tuple[Path, Path]:
        folder = self.config.home / "runtime" / "workers"
        return folder / f"{worker.id}.out", folder / f"{worker.id}.err"

    @staticmethod
    def read(path: Path) -> str:
        return path.read_text(errors="replace") if path.is_file() else ""

    @staticmethod
    def is_running(pid: int) -> bool:
        return ProcessCheck.is_running(pid)

    def stop(self, worker: Worker) -> None:
        if self.is_running(worker.pid) and os.getpgid(worker.pid) == worker.pid:
            os.killpg(worker.pid, signal.SIGTERM)

    def workplace(self, worker: Worker) -> tuple[str, ...]:
        folder = self.branch.place(worker)
        if not worker.worktree or folder.is_dir():
            return worker.repositories
        names = self.branch.brief_folders(worker.brief) or self.branch.inner_folders()
        try:
            return self.prepared(worker, names, self.worktree_creation)
        except WorktreeFailure:
            self.branch.discarded(worker, names)
            raise

    def renewed(self, worker: Worker, brief: str) -> tuple[str, ...]:
        from journal.features.workers.feature import Workers as Feature
        if not worker.worktree:
            return worker.repositories
        names = tuple(dict.fromkeys((*worker.repositories, *self.branch.brief_folders(brief))))
        if not self.branch.folder(worker).is_dir():
            return self.prepared(worker, names, self.worktree_restoration)
        if not self.settings.option(Feature.WORKTREE_STEP):
            return worker.repositories
        return self.inner_worktrees(worker, names)

    def prepared(self, worker: Worker, names: tuple[str, ...], maker: Callable[[Worker, tuple[str, ...]], tuple[str, ...]]) -> tuple[str, ...]:
        from journal.features.workers.feature import Workers as Feature
        folder = self.branch.folder(worker)
        self.commands.run(worker, Feature.PREPARATION_COMMANDS.texts(self.settings.option(Feature.PREPARATION_COMMANDS)), self.config.root, names)
        repositories = maker(worker, names) if self.settings.option(Feature.WORKTREE_STEP) else ()
        self.commands.run(worker, Feature.COMPLETION_COMMANDS.texts(self.settings.option(Feature.COMPLETION_COMMANDS)), folder if folder.is_dir() else self.config.root, names)
        if not folder.is_dir():
            raise WorktreeFailure(worker.name, f"the worktree commands made no worktree at {folder}; with the journal's own step off, they make it there on the branch {self.branch.name(worker)}")
        return repositories or tuple(name for name in names if (folder / name / ".git").exists())

    def worktree_creation(self, worker: Worker, names: tuple[str, ...]) -> tuple[str, ...]:
        self.added(worker, "-b", self.branch.name(worker), str(self.branch.folder(worker)), "HEAD")
        return self.inner_worktrees(worker, names)

    def worktree_restoration(self, worker: Worker, names: tuple[str, ...]) -> tuple[str, ...]:
        folder, name = self.branch.folder(worker), self.branch.name(worker)
        self.branch.git("worktree", "prune")
        if self.branch.git("rev-parse", "--verify", "-q", f"refs/heads/{name}").returncode == 0:
            self.added(worker, str(folder), name)
        else:
            self.added(worker, "-b", name, str(folder), "HEAD")
        return self.inner_worktrees(worker, names)

    def inner_worktrees(self, worker: Worker, names: tuple[str, ...]) -> tuple[str, ...]:
        repositories = self.inner_added(worker, names)
        self.libraries.placed(worker.with_(repositories=repositories))
        return repositories

    def inner_added(self, worker: Worker, names: tuple[str, ...]) -> tuple[str, ...]:
        return tuple(name for name in names if self.inner_worktree(worker, name))

    def inner_worktree(self, worker: Worker, name: str) -> bool:
        checkout, path, branch = self.config.root / name, self.branch.folder(worker) / name, self.branch.name(worker)
        if (path / ".git").exists():
            return True
        self.branch.git("worktree", "prune", cwd=checkout)
        if self.branch.git("rev-parse", "--verify", "-q", f"refs/heads/{branch}", cwd=checkout).returncode == 0:
            argv = (str(path), branch)
        elif self.branch.git("rev-parse", "--verify", "-q", "HEAD", cwd=checkout).returncode == 0:
            argv = ("-b", branch, str(path), "HEAD")
        else:
            return False
        try:
            outcome = self.branch.checkout_git("worktree", "add", "-q", *argv, cwd=checkout)
        except subprocess.TimeoutExpired as expired:
            raise WorktreeFailure(worker.name, f"{name} took longer than {expired.timeout:.0f} seconds to check out") from expired
        if outcome.returncode != 0:
            raise WorktreeFailure(worker.name, f"{name}: {outcome.stderr.strip()}")
        return True

    def added(self, worker: Worker, *argv: str) -> None:
        if self.branch.git("rev-parse", "--verify", "-q", "HEAD").returncode != 0:
            raise WorktreeFailure(worker.name, "the project has no commit yet, so there is no tip to cut a worktree from; make a first commit")
        added = self.branch.git("worktree", "add", "-q", *argv)
        if added.returncode != 0:
            self.branch.git("worktree", "prune")
            raise WorktreeFailure(worker.name, added.stderr.strip())
