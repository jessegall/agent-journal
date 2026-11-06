import os
import signal
import subprocess
import threading
from collections.abc import Sequence
from functools import cache

from core.base.caller.process_row import ProcessRow
from core.base.journal_home import JournalHome
from core.base.model.event_form import EventForm
from core.base.running_script import RunningScript
from core.base.timestamp import Timestamp


class RunningScripts:
    """The plugin processes running now, one list for each journal home, since every request and round has a
    container of its own. A process is known by its pid alone: an unreaped Popen keeps its pid from being reused
    while it is listed. Nothing here reads the process table, because a program starts under the write lock on
    the hook path. A variable proves nothing, so the chain of processes is the only way to be a script."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.scripts: dict[int, RunningScript] = {}

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

    def owner(self, steps: Sequence[ProcessRow]) -> str:
        with self.lock:
            return next((self.scripts[step.pid].plugin for step in steps if step.pid in self.scripts), "")

    def running(self, plugin: str) -> tuple[RunningScript, ...]:
        with self.lock:
            return tuple(script for script in self.scripts.values() if script.plugin == plugin)

    def stop(self, plugin: str) -> None:
        for script in self.running(plugin):
            try:
                os.killpg(script.process.pid, signal.SIGKILL)
            except (ProcessLookupError, PermissionError):
                continue
