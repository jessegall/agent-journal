import json
import socket
import time

from journal.config import Config
from journal.engine.typed_lines import TypedLines
from journal.old_supervisor import OldSupervisor
from journal.repositories.environments import Environments

MARK = "[journal]"
AGENT, JOURNAL = "agent", "journal"
"""The names of the supervisor's two processes: the agent in front, the journal beside it."""
WAIT = 5.0
"""How long a supervisor has to answer a request."""


class SupervisorLink:
    """The journal's end of each supervisor's inbox: a request a line of JSON, its answer a line back, or, to a supervisor from before the protocol, a datagram with nothing read back. A supervisor announces its inbox under the runtime folder by its environment's name while it runs; an environment with none announced hears nothing. Every line typed starts with the mark, so the agent can tell the journal from the user."""

    def __init__(self, config: Config, environments: Environments, typed: TypedLines) -> None:
        self.config, self.environments, self.typed = config, environments, typed
        self._chosen_at: dict[int, float] = {}
        self._viewer_keyed_at: dict[int, float] = {}

    def type(self, environment_id: int, line: str, after: float = 0.0) -> None:
        """A line of the journal's, marked, and noted until its prompt hook proves it arrived."""
        marked = f"{MARK} {line}"
        self.typed.typed(environment_id, marked)
        self._send(environment_id, {"verb": "type", "name": AGENT, "line": marked, "after": after})

    def type_again(self, environment_id: int, marked: str) -> None:
        """A marked line typed once more, as it was."""
        self._send(environment_id, {"verb": "type", "name": AGENT, "line": marked, "after": 0.0})

    def type_raw(self, environment_id: int, line: str) -> None:
        """What the user typed in the viewer's terminal pane, as the user, without the mark."""
        self._viewer_keyed_at[environment_id] = time.time()
        self._send(environment_id, {"verb": "type", "name": AGENT, "line": line, "after": 0.0})

    def keys(self, environment_id: int, keys: str) -> None:
        """Keys written to the agent's terminal as they are, with no Enter after them: an arrow, Enter, Escape."""
        self._send(environment_id, {"verb": "keys", "name": AGENT, "keys": keys})

    def choose(self, environment_id: int, command: str) -> None:
        """A provider command typed for the user's pick in the agent bar, noted so a confirmation it brings up is the journal's to answer."""
        self._chosen_at[environment_id] = time.time()
        self._send(environment_id, {"verb": "type", "name": AGENT, "line": command, "after": 0.0})

    def chosen_at(self, environment_id: int) -> float:
        return self._chosen_at.get(environment_id, 0.0)

    def confirmed(self, environment_id: int) -> None:
        """The pick's confirmation is answered: a later menu is not the pick's."""
        self._chosen_at.pop(environment_id, None)

    def screen(self, environment_id: int) -> str:
        """The newest output of the agent's terminal, as the supervisor mirrors it, read as text; empty when there is none."""
        path = self.mirrored(environment_id, "out")
        return path.read_bytes().decode(errors="replace") if path.exists() else ""

    def screen_changed_at(self, environment_id: int) -> float:
        path = self.mirrored(environment_id, "out")
        return path.stat().st_mtime if path.exists() else 0.0

    def keyed_at(self, environment_id: int) -> float:
        """When the user last pressed a key for the agent: at the keyboard, as the supervisor notes it, or in the viewer's terminal pane."""
        path = self.mirrored(environment_id, "keyed")
        at_keyboard = path.stat().st_mtime if path.exists() else 0.0
        return max(at_keyboard, self._viewer_keyed_at.get(environment_id, 0.0))

    def mirrored(self, environment_id: int, kind: str):
        return self.config.home / "runtime" / "screens" / f"{self.environments.find(environment_id).name}.{kind}"

    def restart_agent(self, environment_id: int, resume: tuple[str, ...]) -> None:
        self._send(environment_id, {"verb": "restart", "name": AGENT, "resume": list(resume)})

    def restart_journal(self, environment_id: int) -> None:
        self._send(environment_id, {"verb": "restart", "name": JOURNAL})

    def stop(self, environment_id: int) -> None:
        self._send(environment_id, {"verb": "stop", "name": AGENT})

    def inbox_of(self, environment_id: int) -> str:
        return self.announced(environment_id).get("socket", "")

    def announced(self, environment_id: int) -> dict:
        """What the environment's supervisor announced: its socket and the protocol it speaks, or a bare path from a supervisor before the protocol; nothing when none runs."""
        path = self.config.home / "runtime" / "inboxes" / self.environments.find(environment_id).name
        text = path.read_text().strip() if path.is_file() else ""
        return json.loads(text) if text.startswith("{") else {"socket": text} if text else {}

    def _send(self, environment_id: int, request: dict) -> dict:
        announced = self.announced(environment_id)
        if not announced:
            return {"ok": False, "error": "no supervisor runs here"}
        if "protocol" not in announced:
            with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as out:
                out.sendto(json.dumps(OldSupervisor.datagram(request)).encode(), announced["socket"])
            return {"ok": True}
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as link:
            link.settimeout(WAIT)
            link.connect(announced["socket"])
            link.sendall((json.dumps(request) + "\n").encode())
            return json.loads(link.makefile("rb").readline())
