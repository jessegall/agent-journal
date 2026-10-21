import json
import os
import socket
import time
from pathlib import Path

from journal.config import Config
from journal.engine.support.typed_line import TypedLine
from journal.support.queued_line import QueuedLine
from journal.support.typed_lines import BATCH_SECONDS, TypedLines
from journal.repositories.setting_rows import SettingRows
from journal.support.old_supervisor import OldSupervisor
from journal.support.supervisor_announcement import SupervisorAnnouncement
from journal.support.supervisor_reply import SupervisorReply
from journal.support.supervisor_socket import SupervisorSocket
from journal.repositories.environments import Environments

JOURNAL_PREFIX = "[journal]"
AGENT, JOURNAL = "agent", "journal"


class SupervisorLink:
    """The journal's end of each supervisor's inbox: a request a line of JSON, its answer a line back, or, to a supervisor that takes datagrams, a datagram with nothing read back. A supervisor announces its inbox under the runtime folder by its environment's name while it runs; an environment with none announced hears nothing. Every line typed starts with the mark, so the agent can tell the journal from the user."""

    def __init__(self, config: Config, environments: Environments, typed: TypedLines, settings: SettingRows) -> None:
        self.config, self.environments, self.typed, self.settings = config, environments, typed, settings
        self._chosen_at: dict[int, float] = {}
        self._viewer_keyed_at: dict[int, float] = {}

    def type(self, environment_id: int, line: str, after: float = 0.0) -> None:
        if self.typed.is_disabled(environment_id):
            return
        marked = f"{JOURNAL_PREFIX} {' '.join(line.split())}"
        if self.is_busy(environment_id):
            self.typed.hold(QueuedLine(environment_id, marked, after))
            return
        self.type_whole(environment_id, marked, after)

    def type_whole(self, environment_id: int, marked: str, after: float) -> None:
        for piece in TypedLine.pieces(marked, JOURNAL_PREFIX):
            self.typed.typed(environment_id, piece)
            self._send(environment_id, "type", {"name": AGENT, "line": piece, "after": after})

    def is_busy(self, environment_id: int) -> bool:
        return self.typed.is_paused(environment_id) or self.typed.is_waiting(environment_id) or self.typed.is_within_window(environment_id, self.batch_seconds())

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
        if self.is_busy(environment_id):
            return
        held = self.typed.held_as_one(environment_id)
        if held is not None:
            self.type_whole(environment_id, held.line, held.after)

    def batch_seconds(self) -> float:
        return float(self.settings.project("delivery.batch_seconds", BATCH_SECONDS))

    def type_again(self, environment_id: int, marked: str) -> None:
        self._send(environment_id, "type", {"name": AGENT, "line": marked, "after": 0.0})

    def type_raw(self, environment_id: int, line: str) -> None:
        self._viewer_keyed_at[environment_id] = time.time()
        self._send(environment_id, "type", {"name": AGENT, "line": line, "after": 0.0})

    def keys(self, environment_id: int, keys: str) -> None:
        self._send(environment_id, "keys", {"name": AGENT, "keys": keys})

    def choose(self, environment_id: int, command: str) -> None:
        self._chosen_at[environment_id] = time.time()
        self._send(environment_id, "type", {"name": AGENT, "line": command, "after": 0.0})

    def chosen_at(self, environment_id: int) -> float:
        return self._chosen_at.get(environment_id, 0.0)

    def confirmed(self, environment_id: int) -> None:
        self._chosen_at.pop(environment_id, None)

    def screen(self, environment_id: int) -> str:
        path = self.mirrored(environment_id, "out")
        return path.read_bytes().decode(errors="replace") if path else ""

    def screen_changed_at(self, environment_id: int) -> float:
        path = self.mirrored(environment_id, "out")
        return path.stat().st_mtime if path else 0.0

    def keyed_at(self, environment_id: int) -> float:
        path = self.mirrored(environment_id, "keyed")
        at_keyboard = path.stat().st_mtime if path else 0.0
        return max(at_keyboard, self._viewer_keyed_at.get(environment_id, 0.0))

    def mirrored(self, environment_id: int, kind: str) -> Path | None:
        announced = self.announced(environment_id)
        path = Path(announced.screen).with_suffix(f".{kind}") if announced and announced.screen else None
        return path if path and path.exists() else None

    def start(self, environment_id: int, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path) -> SupervisorReply:
        return self._send(environment_id, "start", {"name": name, "command": command, "folder": str(folder), "env": environ, "log": str(log)})

    def start_clean(self, environment_id: int, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path, keep: bool) -> SupervisorReply:
        return self._send(environment_id, "start", {"name": name, "command": command, "folder": str(folder), "env": environ, "log": str(log), "inherit": False, "keep": keep})

    def stop_service(self, environment_id: int, name: str) -> None:
        self._send(environment_id, "stop", {"name": name})

    def restart_agent(self, environment_id: int, resume: tuple[str, ...]) -> None:
        self._send(environment_id, "restart", {"name": AGENT, "resume": list(resume)})

    def restart_journal(self, environment_id: int) -> None:
        self._send(environment_id, "restart", {"name": JOURNAL})

    def stop(self, environment_id: int) -> None:
        self._send(environment_id, "stop", {"name": AGENT})

    def hosting(self) -> int | None:
        hosts = self.environments.matching(name=os.environ.get("JOURNAL_ENV", ""))
        return hosts[0].id if hosts and self.runs(hosts[0].id) else None

    def runs(self, environment_id: int) -> bool:
        announced = self.announced(environment_id)
        if announced is None:
            return False
        if not announced.speaks_the_protocol:
            return Path(announced.socket).is_socket()
        try:
            return self._send(environment_id, "hello", {}).ok
        except OSError:
            return False

    def announced(self, environment_id: int) -> SupervisorAnnouncement | None:
        path = self.config.home / "runtime" / "inboxes" / self.environments.find(environment_id).name
        text = path.read_text().strip() if path.is_file() else ""
        if not text:
            return None
        return SupervisorAnnouncement.from_json(json.loads(text)) if text.startswith("{") else SupervisorAnnouncement(text, OldSupervisor.screen(self.config.home, path.name))

    def _send(self, environment_id: int, verb: str, fields: dict) -> SupervisorReply:
        announced = self.announced(environment_id)
        if announced is None:
            return SupervisorReply(False, "no supervisor runs here")
        if announced.speaks_the_protocol:
            return SupervisorSocket.ask(announced.socket, {"verb": verb, **fields})
        if not OldSupervisor.takes(verb):
            return SupervisorReply(False, f"the supervisor running predates the protocol and takes no {verb}")
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as out:
            out.sendto(json.dumps(OldSupervisor.datagram(verb, fields)).encode(), announced.socket)
        return SupervisorReply(True)
