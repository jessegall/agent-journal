import json
import socket
import threading
from pathlib import Path

from core.base.type_guards import is_mapping
from core.modules.agents.support.launcher_link import STOP_FIELD, STOPPED_ANSWER

ACCEPT_TIMEOUT_SECONDS = 10


class FakeLauncher:
    """A launcher socket in a story's journal folder that takes requests and keeps them until it is closed,
    answering each as told; told nothing, it answers a stop as the launcher does and a start, as an older
    launcher does, not at all. With answers, request number n gets answers[n] and any later request gets
    the last one."""

    def __init__(self, path: Path, answer: bytes = b"", request_count: int = 1, answers: tuple[bytes, ...] = ()) -> None:
        self.path, self.requests, self.answer, self.request_count = path, list[dict[str, object]](), answer, request_count
        self.answers, self.arrived = answers, threading.Condition()
        self.server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.thread = threading.Thread(target=self.accepted, daemon=True)

    @classmethod
    def listening(cls, path: Path, answer: bytes = b"", request_count: int = 1, answers: tuple[bytes, ...] = ()) -> "FakeLauncher":
        launcher = cls(path, answer, request_count, answers)
        launcher.listen()
        return launcher

    def listen(self) -> None:
        self.path.unlink(missing_ok=True)
        self.server.bind(str(self.path))
        self.server.listen(1)
        self.server.settimeout(ACCEPT_TIMEOUT_SECONDS)
        self.thread.start()

    def accepted(self) -> None:
        while True:
            try:
                connection, _ = self.server.accept()
            except OSError:
                return
            with connection, connection.makefile("r") as stream:
                request = json.loads(stream.readline())
                if "typed" in request:
                    connection.sendall(b"typed")
                    continue
                with self.arrived:
                    self.requests.append(request)
                    self.arrived.notify_all()
                connection.sendall(self.reply(request))

    def reply(self, request: dict[str, object]) -> bytes:
        if self.answers:
            return self.answers[min(len(self.requests), len(self.answers)) - 1]
        if not self.answer and STOP_FIELD in request:
            return STOPPED_ANSWER
        return self.answer

    def drain_requests(self) -> None:
        with self.arrived:
            self.arrived.wait_for(lambda: len(self.requests) >= self.request_count, ACCEPT_TIMEOUT_SECONDS)

    @property
    def starts(self) -> list[dict[str, object]]:
        return [request for request in self.requests if STOP_FIELD not in request]

    def expect_started(self, agent_id: int, session: str, folder: Path) -> None:
        self.drain_requests()
        self.server.close()
        assert self.requests, f"the launcher was handed nothing for agent {agent_id}"
        request = self.requests[0]
        expected = {"agent_id": agent_id, "session": session, "folder": str(folder)}
        assert {key: request.get(key) for key in expected} == expected, f"the launcher was handed {request}, not {expected}"
        command, variables = request.get("command"), request.get("variables")
        assert isinstance(command, list) and command, f"the agent's program has no command: {command}"
        assert is_mapping(variables) and variables.get("JOURNAL_ENV") == "main" and variables.get("AGENT_JOURNAL_ACTIVE") == "1", \
            f"the agent's hooks would not reach environment main: {variables}"
