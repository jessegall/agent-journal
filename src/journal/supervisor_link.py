import json
import socket

from journal.config import Config
from journal.repositories.environments import Environments

MARK = "[journal]"


class SupervisorLink:
    """The journal's end of each supervisor's inbox: one datagram per instruction, nothing read back. A supervisor announces its inbox under the runtime folder by its environment's name while it runs; an environment with none announced hears nothing. Every line typed starts with the mark, so the agent can tell the journal from the user."""

    def __init__(self, config: Config, environments: Environments) -> None:
        self.config, self.environments = config, environments

    def type(self, environment_id: int, line: str, after: float = 0.0) -> None:
        self._send(environment_id, {"type": "Type", "line": f"{MARK} {line}", "after": after})

    def type_raw(self, environment_id: int, line: str) -> None:
        """What the user typed in the viewer's terminal pane, as the user, without the mark."""
        self._send(environment_id, {"type": "Type", "line": line, "after": 0.0})

    def restart_agent(self, environment_id: int, resume: tuple[str, ...]) -> None:
        self._send(environment_id, {"type": "RestartAgent", "resume": list(resume)})

    def restart_journal(self, environment_id: int) -> None:
        self._send(environment_id, {"type": "RestartJournal"})

    def stop(self, environment_id: int) -> None:
        self._send(environment_id, {"type": "Stop"})

    def inbox_of(self, environment_id: int) -> str:
        announced = self.config.home / "runtime" / "inboxes" / self.environments.find(environment_id).name
        return announced.read_text().strip() if announced.is_file() else ""

    def _send(self, environment_id: int, instruction: dict) -> None:
        path = self.inbox_of(environment_id)
        if not path:
            return
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as out:
            out.sendto(json.dumps(instruction).encode(), path)
