import json
import socket
import threading
from pathlib import Path

from core.modules.agents.support.launcher_link import STOP_FIELD

ACCEPT_TIMEOUT_SECONDS = 10


class FakeLauncher:
    """A launcher socket in a story's journal folder that takes start requests and keeps them, under a time
    limit, answering each as told or, as an older launcher does, not at all. With answers, request number n
    gets answers[n] and any later request gets the last one."""

    def __init__(self, path: Path, answer: bytes = b"", request_count: int = 1, answers: tuple[bytes, ...] = ()) -> None:
        self.path, self.requests, self.answer, self.request_count = path, list[dict[str, object]](), answer, request_count
        self.answers = answers
        self.server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.server.bind(str(path))
        self.server.listen(1)
        self.server.settimeout(ACCEPT_TIMEOUT_SECONDS)
        self.thread = threading.Thread(target=self.accepted, daemon=True)
        self.thread.start()

    def accepted(self) -> None:
        while len(self.requests) < self.request_count:
            connection, _ = self.server.accept()
            with connection, connection.makefile("r") as stream:
                request = json.loads(stream.readline())
                if "typed" in request:
                    connection.sendall(b"typed")
                    continue
                self.requests.append(request)
                connection.sendall(self.answers[min(len(self.requests), len(self.answers)) - 1] if self.answers else self.answer)

    @property
    def starts(self) -> list[dict[str, object]]:
        return [request for request in self.requests if STOP_FIELD not in request]

    def expect_started(self, agent_id: int, session: str, folder: Path) -> None:
        self.thread.join(ACCEPT_TIMEOUT_SECONDS)
        self.server.close()
        assert self.requests, f"the launcher was handed nothing for agent {agent_id}"
        request = self.requests[0]
        expected = {"agent_id": agent_id, "session": session, "folder": str(folder)}
        assert {key: request.get(key) for key in expected} == expected, f"the launcher was handed {request}, not {expected}"
        command, variables = request.get("command"), request.get("variables")
        assert isinstance(command, list) and command, f"the agent's program has no command: {command}"
        assert isinstance(variables, dict) and variables.get("JOURNAL_ENV") == "main" and variables.get("AGENT_JOURNAL_ACTIVE") == "1", \
            f"the agent's hooks would not reach environment main: {variables}"
