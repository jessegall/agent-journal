import json
import socket
import time
from pathlib import Path

from journal.config import Config
from journal.engine.held_line import HeldLine
from journal.engine.typed_lines import TypedLines
from journal.old_supervisor import OldSupervisor
from journal.supervisor_announcement import SupervisorAnnouncement
from journal.supervisor_reply import SupervisorReply
from journal.supervisor_socket import SupervisorSocket
from journal.repositories.environments import Environments

MARK = "[journal]"
AGENT, JOURNAL = "agent", "journal"
"""The names of the supervisor's two processes: the agent in front, the journal beside it."""


class SupervisorLink:
    """The journal's end of each supervisor's inbox: a request a line of JSON, its answer a line back, or, to a supervisor that takes datagrams, a datagram with nothing read back. A supervisor announces its inbox under the runtime folder by its environment's name while it runs; an environment with none announced hears nothing. Every line typed starts with the mark, so the agent can tell the journal from the user."""

    def __init__(self, config: Config, environments: Environments, typed: TypedLines) -> None:
        self.config, self.environments, self.typed = config, environments, typed
        self._chosen_at: dict[int, float] = {}
        self._viewer_keyed_at: dict[int, float] = {}

    def type(self, environment_id: int, line: str, after: float = 0.0) -> None:
        """A line of the journal's, marked, on one line however many it was handed, and noted until its prompt hook proves it arrived; held while an earlier line is still on its way. A line with breaks reaches the agent as pasted text, which never matches it, so it would be typed again."""
        marked = f"{MARK} {' '.join(line.split())}"
        if self.typed.is_waiting(environment_id):
            self.typed.hold(HeldLine(environment_id, marked, after))
            return
        self.typed.typed(environment_id, marked)
        self._send(environment_id, "type", {"name": AGENT, "line": marked, "after": after})

    def release(self, environment_id: int) -> None:
        """The next held line typed, once no earlier line is on its way."""
        if self.typed.is_waiting(environment_id):
            return
        held = self.typed.next_held(environment_id)
        if held is not None:
            self.typed.typed(environment_id, held.line)
            self._send(environment_id, "type", {"name": AGENT, "line": held.line, "after": held.after})

    def type_again(self, environment_id: int, marked: str) -> None:
        """A marked line typed once more, as it was."""
        self._send(environment_id, "type", {"name": AGENT, "line": marked, "after": 0.0})

    def type_raw(self, environment_id: int, line: str) -> None:
        """What the user typed in the viewer's terminal pane, as the user, without the mark."""
        self._viewer_keyed_at[environment_id] = time.time()
        self._send(environment_id, "type", {"name": AGENT, "line": line, "after": 0.0})

    def keys(self, environment_id: int, keys: str) -> None:
        """Keys written to the agent's terminal as they are, with no Enter after them: an arrow, Enter, Escape."""
        self._send(environment_id, "keys", {"name": AGENT, "keys": keys})

    def choose(self, environment_id: int, command: str) -> None:
        """A provider command typed for the user's pick in the agent bar, noted so a confirmation it brings up is the journal's to answer."""
        self._chosen_at[environment_id] = time.time()
        self._send(environment_id, "type", {"name": AGENT, "line": command, "after": 0.0})

    def chosen_at(self, environment_id: int) -> float:
        return self._chosen_at.get(environment_id, 0.0)

    def confirmed(self, environment_id: int) -> None:
        """The pick's confirmation is answered: a later menu is not the pick's."""
        self._chosen_at.pop(environment_id, None)

    def screen(self, environment_id: int) -> str:
        """The newest output of the agent's terminal, as the supervisor mirrors it, read as text; empty when there is none."""
        path = self.mirrored(environment_id, "out")
        return path.read_bytes().decode(errors="replace") if path else ""

    def screen_changed_at(self, environment_id: int) -> float:
        path = self.mirrored(environment_id, "out")
        return path.stat().st_mtime if path else 0.0

    def keyed_at(self, environment_id: int) -> float:
        """When the user last pressed a key for the agent: at the keyboard, as the supervisor notes it, or in the viewer's terminal pane."""
        path = self.mirrored(environment_id, "keyed")
        at_keyboard = path.stat().st_mtime if path else 0.0
        return max(at_keyboard, self._viewer_keyed_at.get(environment_id, 0.0))

    def mirrored(self, environment_id: int, kind: str) -> Path | None:
        """The mirror of the agent's screen, or the file noting keys beside it, where the supervisor announced it; none when no supervisor runs or the file is not there yet."""
        announced = self.announced(environment_id)
        path = Path(announced.screen).with_suffix(f".{kind}") if announced and announced.screen else None
        return path if path and path.exists() else None

    def start(self, environment_id: int, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path) -> SupervisorReply:
        """A service started under the environment's supervisor; one already running under the name is left as it is."""
        return self._send(environment_id, "start", {"name": name, "command": command, "folder": str(folder), "env": environ, "log": str(log)})

    def start_clean(self, environment_id: int, name: str, command: list[str], folder: Path, environ: dict[str, str], log: Path, keep: bool) -> SupervisorReply:
        """A service started with the environment it is given and nothing of the supervisor's own, such as a plugin's; keep says whether it is started again when it dies."""
        return self._send(environment_id, "start", {"name": name, "command": command, "folder": str(folder), "env": environ, "log": str(log), "inherit": False, "keep": keep})

    def stop_service(self, environment_id: int, name: str) -> None:
        self._send(environment_id, "stop", {"name": name})

    def restart_agent(self, environment_id: int, resume: tuple[str, ...]) -> None:
        self._send(environment_id, "restart", {"name": AGENT, "resume": list(resume)})

    def restart_journal(self, environment_id: int) -> None:
        self._send(environment_id, "restart", {"name": JOURNAL})

    def stop(self, environment_id: int) -> None:
        self._send(environment_id, "stop", {"name": AGENT})

    def runs(self, environment_id: int) -> bool:
        """Whether a supervisor answers for the environment: one on the protocol says hello, one from before it has its socket open; an announce file a dead supervisor left answers nothing."""
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
        """What the environment's supervisor announced: its socket and the protocol it speaks, or a bare path from a datagram supervisor; nothing when none runs."""
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
