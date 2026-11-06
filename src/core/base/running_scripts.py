from collections import deque
import os
import signal
import subprocess
import threading
from collections.abc import Mapping, Sequence
from functools import cache
from pathlib import Path

from core.base.caller.process_row import ProcessRow
from core.base.journal_home import JournalHome
from core.base.file_access import FileAccess
from core.base.leftover_process import LeftoverProcess
from core.base.model.event_form import EventForm
from core.base.running_script import RunningScript
from core.base.script_skip import ScriptSkip
from core.base.script_stop import ScriptStop
from core.base.timestamp import Timestamp


KEPT_LINE_COUNT = 50


class RunningScripts:
    """The plugin processes running now, scripts and services alike, one list for each journal home, since every
    request and round has a container of its own. A process is known by its pid alone: an unreaped Popen keeps its
    pid from being reused while it is listed. Nothing here reads the process table, because a program starts under
    the write lock on the hook path. A variable proves nothing, so the chain of processes is the only way to be a
    script."""

    def __init__(self, pid_folder: Path | None = None) -> None:
        self.pid_folder = pid_folder
        self.lock = threading.Lock()
        self.scripts: dict[int, RunningScript] = {}
        self.services: dict[int, str] = {}
        self.stop_reasons: dict[int, ScriptStop] = {}
        self.sent_lines: dict[str, deque[str]] = {}
        self.skips: dict[tuple[str, str, EventForm], ScriptSkip] = {}
        self.failing_tries: dict[str, Timestamp] = {}

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "RunningScripts":
        return cls(home.plugin_socket_folder)

    def start(self, process: "subprocess.Popen[str]", plugin: str, key: str, form: EventForm, started_at: Timestamp) -> None:
        with self.lock:
            self.scripts[process.pid] = RunningScript(process, plugin, key, form, started_at)
        if self.pid_folder is not None:
            self.pid_folder.mkdir(parents=True, exist_ok=True)
            program = process.args[0] if isinstance(process.args, (list, tuple)) else process.args
            FileAccess.shared().write(self.pid_folder / f"script-{plugin}-{process.pid}.pid", f"{process.pid}\n{program}")

    def finish(self, process: "subprocess.Popen[str]") -> None:
        with self.lock:
            script = self.scripts.get(process.pid)
            self.scripts.pop(process.pid, None)
            self.stop_reasons.pop(process.pid, None)
        if self.pid_folder is not None and script is not None:
            (self.pid_folder / f"script-{script.plugin}-{process.pid}.pid").unlink(missing_ok=True)

    def reap_leftovers(self) -> None:
        if self.pid_folder is None or not self.pid_folder.is_dir():
            return
        for pid_file in self.pid_folder.glob("script-*.pid"):
            pid, _, program = FileAccess.shared().read(pid_file).partition("\n")
            LeftoverProcess.stop(int(pid), program)
            pid_file.unlink(missing_ok=True)

    def stop_reason(self, process: "subprocess.Popen[str]") -> ScriptStop | None:
        with self.lock:
            return self.stop_reasons.get(process.pid)

    def keep_line(self, plugin: str, line: str) -> None:
        with self.lock:
            self.sent_lines.setdefault(plugin, deque(maxlen=KEPT_LINE_COUNT)).append(line)

    def lines(self, plugin: str) -> tuple[str, ...]:
        with self.lock:
            return tuple(self.sent_lines.get(plugin, ()))

    def skipped(self, plugin: str, key: str, form: EventForm, reason: str, at: Timestamp) -> None:
        with self.lock:
            self.skips[(plugin, key, form)] = ScriptSkip(reason, at)

    def newest_skip(self, plugin: str, key: str, form: EventForm) -> ScriptSkip | None:
        with self.lock:
            return self.skips.get((plugin, key, form))

    def failing_try(self, plugin: str) -> Timestamp | None:
        with self.lock:
            return self.failing_tries.get(plugin)

    def keep_failing_try(self, plugin: str, at: Timestamp) -> None:
        with self.lock:
            self.failing_tries[plugin] = at

    def plugin_names(self) -> frozenset[str]:
        with self.lock:
            return frozenset(script.plugin for script in self.scripts.values())

    def keep_services(self, services: Mapping[int, str]) -> None:
        with self.lock:
            self.services = dict(services)

    def owner(self, steps: Sequence[ProcessRow]) -> str:
        with self.lock:
            owners = {**self.services, **{pid: script.plugin for pid, script in self.scripts.items()}}
        return next((owners[step.pid] for step in steps if step.pid in owners), "")

    def running(self, plugin: str) -> tuple[RunningScript, ...]:
        with self.lock:
            return tuple(script for script in self.scripts.values() if script.plugin == plugin)

    def stop(self, plugin: str) -> None:
        self.killed(self.running(plugin), ScriptStop.SWITCHED_OFF)

    def stop_all(self) -> None:
        with self.lock:
            scripts = tuple(self.scripts.values())
        self.killed(scripts, ScriptStop.SERVER)

    def killed(self, scripts: Sequence[RunningScript], reason: ScriptStop) -> None:
        with self.lock:
            self.stop_reasons.update({script.process.pid: reason for script in scripts})
        for script in scripts:
            try:
                os.killpg(script.process.pid, signal.SIGKILL)
            except (ProcessLookupError, PermissionError):
                continue
