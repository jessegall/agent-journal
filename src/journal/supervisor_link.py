import json
import os
import socket
import time
from journal.models.environment import Environment
from pathlib import Path

from journal.config import Config
from journal.support.foreground_option import FOREGROUND_OPTION
from journal.support.queued_line import QueuedLine
from journal.support.typed_lines import TypedLines
from journal.repositories.setting_rows import SettingRows
from journal.support.old_supervisor import OldSupervisor
from journal.support.supervisor_announcement import SupervisorAnnouncement
from journal.support.supervisor_process import SupervisorProcess
from journal.support.supervisor_reply import SupervisorReply
from journal.support.supervisor_socket import SupervisorSocket
from journal.repositories.environments import Environments
from journal.support.time_source import TimeSource
from journal.support.process_usage import ProcessUsage

JOURNAL_PREFIX = "[journal]"
LINE_ERASE = "\x15"
ERASE_MARGIN_LINES = 2
# how long the journal waits before it restarts, so the command that asked for the restart finishes its answer first
RESTART_DELAY_SECONDS = 2.0
AGENT, JOURNAL, SUPERVISOR = "agent", "journal", "supervisor"


class SupervisorLink:
    """The journal's end of each supervisor's inbox: a request is a line of JSON, its answer a line back, or, to a supervisor that takes datagrams, a datagram with no reply read. A supervisor announces its inbox under the runtime folder by its environment's name while it runs; an environment with none announced receives nothing. Every line typed starts with the marker, so the agent can tell the journal from the user."""

    def __init__(self, config: Config, environments: Environments, keystrokes: TypedLines, settings: SettingRows, time_source: TimeSource) -> None:
        self.time_source = time_source
        self.config, self.environments, self.typed, self.settings = config, environments, keystrokes, settings
        self._chosen_at: dict[int, float] = {}
        self._viewer_keyed_at: dict[int, float] = {}

    def type(self, environment_id: int, line: str, following: float = 0.0) -> None:
        if self.typed.is_disabled(environment_id):
            return
        flagged = f"{JOURNAL_PREFIX} {' '.join(line.split())}"
        self.typed.queue(QueuedLine(environment_id, flagged, following, self.time_source.seconds()))
        self.release(environment_id)

    def remark(self, environment_id: int, line: str) -> None:
        if not self.typed.is_disabled(environment_id):
            self.typed.queue(QueuedLine(environment_id, f"{JOURNAL_PREFIX} {' '.join(line.split())}", is_remark=True))

    def wake(self, environment_id: int, first: QueuedLine) -> None:
        self.typed.typed(environment_id, first.line)
        self.typed.work(environment_id)
        self._send(environment_id, "type", {"name": AGENT, "line": first.line, "after": first.delay_seconds})

    def is_busy(self, environment_id: int) -> bool:
        return self.typed.is_paused(environment_id) or self.typed.is_waiting(environment_id) or self.typed.is_working(environment_id)

    def working(self, environment_id: int) -> None:
        self.typed.work(environment_id)

    def stop_refused(self, environment_id: int) -> None:
        self.typed.refuse_stop(environment_id)

    def silence(self, environment_id: int, seconds: float) -> None:
        if self.typed.is_stop_refused(environment_id) and seconds >= self.settings.integer(FOREGROUND_OPTION):
            self.resting(environment_id)
        if not self.typed.is_working(environment_id):
            self.release(environment_id)

    def resting(self, environment_id: int) -> None:
        self.typed.rest(environment_id)
        self.release(environment_id)

    def pending_lines(self, environment_id: int) -> str:
        return "\n".join(self.typed.pending_lines(environment_id))

    def pending_remarks(self, environment_id: int) -> str:
        return "\n".join(self.typed.pending_remarks(environment_id))

    def pending_instructions(self, environment_id: int) -> str:
        return "\n".join(self.typed.pending_instructions(environment_id))

    def disable(self, environment_id: int) -> None:
        self.typed.disable(environment_id)

    def enable(self, environment_id: int) -> None:
        self.typed.enable(environment_id)

    def clear(self, environment_id: int) -> None:
        self.typed.clear(environment_id)

    def pause(self, environment_id: int) -> None:
        self.typed.pause(environment_id)

    def resume(self, environment_id: int) -> None:
        self.typed.resume(environment_id)
        self.release(environment_id)

    def release(self, environment_id: int) -> None:
        first = None if self.is_busy(environment_id) else self.typed.first_instruction(environment_id)
        if first is not None:
            self.wake(environment_id, first)

    def erase(self, environment_id: int) -> None:
        self.keys(environment_id, LINE_ERASE * (self.typed.waiting_count(environment_id) + ERASE_MARGIN_LINES))

    def retype(self, environment_id: int, flagged: str) -> None:
        self._send(environment_id, "type", {"name": AGENT, "line": flagged, "after": 0.0})

    def type_raw(self, environment_id: int, line: str) -> None:
        self._viewer_keyed_at[environment_id] = self.time_source.seconds()
        self._send(environment_id, "type", {"name": AGENT, "line": line, "after": 0.0})

    def keys(self, environment_id: int, keys: str) -> None:
        self._send(environment_id, "keys", {"name": AGENT, "keys": keys})

    def choose(self, environment_id: int, command: str) -> None:
        self._chosen_at[environment_id] = self.time_source.seconds()
        self._send(environment_id, "type", {"name": AGENT, "line": command, "after": 0.0})

    def last_selection(self, environment_id: int) -> float:
        return self._chosen_at.get(environment_id, 0.0)

    def confirmed(self, environment_id: int) -> None:
        self._chosen_at.pop(environment_id, None)

    def screen(self, environment_id: int) -> str:
        path = self.mirrored(environment_id, "out")
        return path.read_bytes().decode(errors="replace") if path else ""

    def last_screen_change(self, environment_id: int) -> float:
        path = self.mirrored(environment_id, "out")
        return path.stat().st_mtime if path else 0.0

    def last_keystroke(self, environment_id: int) -> float:
        path = self.mirrored(environment_id, "keyed")
        keyboard_input = path.stat().st_mtime if path else 0.0
        return max(keyboard_input, self._viewer_keyed_at.get(environment_id, 0.0))

    def mirrored(self, environment_id: int, type_name: str) -> Path | None:
        announced = self.announced(environment_id)
        path = Path(announced.screen).with_suffix(f".{type_name}") if announced and announced.screen else None
        return path if path and path.exists() else None

    def start(self, environment_id: int, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path, health: dict) -> SupervisorReply:
        return self._send(environment_id, "start", {"name": name, "command": command, "folder": str(folder), "env": environ, "log": str(log), "health": health})

    def start_clean(self, environment_id: int, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path, retain: bool) -> SupervisorReply:
        return self._send(environment_id, "start", {"name": name, "command": command, "folder": str(folder), "env": environ, "log": str(log), "inherit": False, "keep": retain})

    def group(self, environment_id: int, pid: int) -> None:
        self._send(environment_id, "group", {"pid": pid})

    def memory(self, environment_id: int) -> dict[int, int]:
        return self._send(environment_id, "memory", {}).groups

    def usage(self, environment_id: int, groups: set[int]) -> dict[int, ProcessUsage]:
        return self._send(environment_id, "usage", {"groups": sorted(groups)}).usage

    def stop_service(self, environment_id: int, name: str) -> None:
        self._send(environment_id, "stop", {"name": name})

    def restart_agent(self, environment_id: int, resume: tuple[str, ...]) -> None:
        self._send(environment_id, "restart", {"name": AGENT, "resume": list(resume)})

    def restart_journal(self, environment_id: int) -> SupervisorReply:
        return self._send(environment_id, "restart", {"name": JOURNAL, "after": RESTART_DELAY_SECONDS})

    def restart_supervisor(self, environment_id: int, resume: tuple[str, ...]) -> None:
        self._send(environment_id, "restart", {"name": SUPERVISOR, "resume": list(resume)})

    def is_outdated(self, environment_id: int) -> bool:
        announced = self.announced(environment_id)
        if announced is None or not announced.is_compatible:
            return False
        try:
            return self._send(environment_id, "hello", {}).outdated
        except OSError:
            return False

    def stop(self, environment_id: int) -> None:
        self._send(environment_id, "stop", {"name": AGENT})

    def hosting(self) -> int | None:
        hosts = self.environments.matching(name=os.environ.get("JOURNAL_ENV", ""))
        return hosts[0].id if hosts and self.runs(hosts[0].row_id) else None

    def outdated(self, environments: list[Environment]) -> list[Environment]:
        return [environment for environment in environments if self.is_outdated(environment.row_id)]

    def running(self, environments: list[Environment]) -> list[Environment]:
        return [environment for environment in environments if self.runs(environment.row_id)]

    def processes(self, environment_id: int) -> tuple[SupervisorProcess, ...]:
        return self._send(environment_id, "list", {}).processes

    def runs(self, environment_id: int) -> bool:
        announced = self.announced(environment_id)
        if announced is None:
            return False
        if not announced.is_compatible:
            return Path(announced.socket).is_socket()
        try:
            return self._send(environment_id, "hello", {}).success
        except OSError:
            return False

    def is_lost(self, environment_id: int) -> bool:
        return self.announced(environment_id) is not None and not self.runs(environment_id)

    def announced(self, environment_id: int) -> SupervisorAnnouncement | None:
        path = self.config.home / "runtime" / "inboxes" / self.environments.find(environment_id).name
        text = path.read_text().strip() if path.is_file() else ""
        if not text:
            return None
        return SupervisorAnnouncement.parsed(json.loads(text)) if text.startswith("{") else SupervisorAnnouncement(text, OldSupervisor.screen(self.config.home, path.name))

    def _send(self, environment_id: int, verb: str, fields: dict) -> SupervisorReply:
        announced = self.announced(environment_id)
        if announced is None:
            return SupervisorReply(False, "no supervisor runs here")
        if announced.is_compatible:
            return SupervisorSocket.ask(announced.socket, {"verb": verb, **fields})
        if not OldSupervisor.takes(verb):
            return SupervisorReply(False, f"the supervisor running predates the protocol and takes no {verb}")
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as output:
            output.sendto(json.dumps(OldSupervisor.datagram(verb, fields)).encode(), announced.socket)
        return SupervisorReply(True)
