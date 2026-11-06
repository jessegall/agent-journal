from collections import deque
import os
import signal
import subprocess
import threading
from collections.abc import Mapping, Sequence
from functools import cache

from core.base.caller.process_row import ProcessRow
from core.base.journal_home import JournalHome
from core.base.model.event_form import EventForm
from core.base.running_script import RunningScript
from core.base.timestamp import Timestamp


KEPT_LINE_COUNT = 50
SWITCHED_OFF_REASON = "the plugin was switched off"
SERVER_STOP_REASON = "the server stopped"


class RunningScripts:
    """The plugin processes running now, scripts and services alike, one list for each journal home, since every
    request and round has a container of its own. A process is known by its pid alone: an unreaped Popen keeps its
    pid from being reused while it is listed. Nothing here reads the process table, because a program starts under
    the write lock on the hook path. A variable proves nothing, so the chain of processes is the only way to be a
    script."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.scripts: dict[int, RunningScript] = {}
        self.services: dict[int, str] = {}
        self.stop_reasons: dict[int, str] = {}
        self.sent_lines: dict[str, deque[str]] = {}
        self.skips: dict[str, str] = {}

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "RunningScripts":
        return cls()

    def start(self, process: "subprocess.Popen[str]", plugin: str, key: str, form: EventForm, started_at: Timestamp) -> None:
        with self.lock:
            self.scripts[process.pid] = RunningScript(process, plugin, key, form, started_at)

    def finish(self, process: "subprocess.Popen[str]") -> None:
        with self.lock:
            self.scripts.pop(process.pid, None)
            self.stop_reasons.pop(process.pid, None)

    def stop_reason(self, process: "subprocess.Popen[str]") -> str:
        with self.lock:
            return self.stop_reasons.get(process.pid, "")

    def keep_line(self, plugin: str, line: str) -> None:
        with self.lock:
            self.sent_lines.setdefault(plugin, deque(maxlen=KEPT_LINE_COUNT)).append(line)

    def lines(self, plugin: str) -> tuple[str, ...]:
        with self.lock:
            return tuple(self.sent_lines.get(plugin, ()))

    def note_skip(self, log_name: str, reason: str) -> None:
        with self.lock:
            self.skips[log_name] = reason

    def newest_skip(self, log_name: str) -> str:
        with self.lock:
            return self.skips.get(log_name, "")

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
        self.killed(self.running(plugin), SWITCHED_OFF_REASON)

    def stop_all(self) -> None:
        with self.lock:
            scripts = tuple(self.scripts.values())
        self.killed(scripts, SERVER_STOP_REASON)

    def killed(self, scripts: Sequence[RunningScript], reason: str) -> None:
        with self.lock:
            self.stop_reasons.update({script.process.pid: reason for script in scripts})
        for script in scripts:
            try:
                os.killpg(script.process.pid, signal.SIGKILL)
            except (ProcessLookupError, PermissionError):
                continue
