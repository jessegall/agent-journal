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
from core.base.plugin_script_process import PluginScriptProcess
from core.base.script_skip import ScriptSkip
from engine.enums.script_stop import ScriptStop
from core.base.timestamp import Timestamp


KEPT_LINE_COUNT = 50


class PluginScriptProcesses:
    """Tracks running plugin scripts and services for a journal home."""

    def __init__(self, pid_folder: Path | None = None) -> None:
        self.pid_folder = pid_folder
        self.lock = threading.Lock()
        self.scripts: dict[int, PluginScriptProcess] = {}
        self.services: dict[int, str] = {}
        self.stop_reasons: dict[int, ScriptStop] = {}
        self.sent_lines: dict[str, deque[str]] = {}
        self.skips: dict[tuple[str, str, EventForm], ScriptSkip] = {}
        self.failing_tries: dict[str, Timestamp] = {}
        self.server_stopped = False

    @classmethod
    @cache
    def shared(cls, home: JournalHome) -> "PluginScriptProcesses":
        return cls(home.plugin_socket_folder)

    def start(self, process: "subprocess.Popen[str]", plugin: str, key: str, form: EventForm, started_at: Timestamp) -> None:
        script = PluginScriptProcess(process, plugin, key, form, started_at)
        with self.lock:
            self.scripts[process.pid] = script
            stopped = self.server_stopped
        if stopped:
            self.killed([script], ScriptStop.SERVER)
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

    def stop_stale_processes(self) -> None:
        if self.pid_folder is None or not self.pid_folder.is_dir():
            return
        for pid_file in self.pid_folder.glob("script-*.pid"):
            pid, _, program = FileAccess.shared().read(pid_file).partition("\n")
            LeftoverProcess.stop(int(pid), program)
            pid_file.unlink(missing_ok=True)

    def stop_reason(self, process: "subprocess.Popen[str]") -> ScriptStop:
        with self.lock:
            return self.stop_reasons.get(process.pid, ScriptStop.STOP_FAILED)

    def keep_line(self, plugin: str, line: str) -> None:
        with self.lock:
            self.sent_lines.setdefault(plugin, deque(maxlen=KEPT_LINE_COUNT)).append(line)

    def lines(self, plugin: str) -> tuple[str, ...]:
        with self.lock:
            return tuple(self.sent_lines.get(plugin, ()))

    def skipped(self, plugin: str, key: str, form: EventForm, reason: str, skipped_at: Timestamp) -> None:
        with self.lock:
            self.skips[(plugin, key, form)] = ScriptSkip(reason, skipped_at)

    def has_skip(self, plugin: str, key: str, form: EventForm) -> bool:
        with self.lock:
            return (plugin, key, form) in self.skips

    def newest_skip(self, plugin: str, key: str, form: EventForm) -> ScriptSkip:
        with self.lock:
            return self.skips[(plugin, key, form)]

    def failing_try(self, plugin: str, first_at: Timestamp) -> Timestamp:
        with self.lock:
            return self.failing_tries.get(plugin, first_at)

    def keep_failing_try(self, plugin: str, failed_at: Timestamp) -> None:
        with self.lock:
            self.failing_tries[plugin] = failed_at

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

    def running(self, plugin: str) -> tuple[PluginScriptProcess, ...]:
        with self.lock:
            return tuple(script for script in self.scripts.values() if script.plugin == plugin)

    def stop(self, plugin: str) -> None:
        self.killed(self.running(plugin), ScriptStop.PLUGIN_DISABLED)

    def server_started(self) -> None:
        with self.lock:
            self.server_stopped = False

    def stop_all(self) -> None:
        with self.lock:
            self.server_stopped = True
            scripts = tuple(self.scripts.values())
        self.killed(scripts, ScriptStop.SERVER)

    def killed(self, scripts: Sequence[PluginScriptProcess], reason: ScriptStop) -> None:
        with self.lock:
            self.stop_reasons.update({script.process.pid: reason for script in scripts})
        for script in scripts:
            try:
                os.killpg(script.process.pid, signal.SIGKILL)
            except (ProcessLookupError, PermissionError):
                continue


RunningScripts = PluginScriptProcesses
