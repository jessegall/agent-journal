import json
import socket
import threading
from pathlib import Path

ACCEPT_TIMEOUT_SECONDS = 10


class FakeLauncher:
    """A launcher socket in a story's journal folder that takes one worker request and keeps it, under a time limit."""

    def __init__(self, path: Path) -> None:
        self.path, self.requests = path, list[dict[str, object]]()
        self.server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.server.bind(str(path))
        self.server.listen(1)
        self.server.settimeout(ACCEPT_TIMEOUT_SECONDS)
        self.thread = threading.Thread(target=self.accepted, daemon=True)
        self.thread.start()

    def accepted(self) -> None:
        connection, _ = self.server.accept()
        with connection, connection.makefile("r") as stream:
            self.requests.append(json.loads(stream.readline()))

    def expect_worker(self, worker_id: int, session: str, folder: Path) -> None:
        self.thread.join(ACCEPT_TIMEOUT_SECONDS)
        self.server.close()
        assert self.requests, f"the launcher was handed nothing for worker {worker_id}"
        request = self.requests[0]
        expected = {"agent_id": worker_id, "session": session, "folder": str(folder)}
        assert {key: request.get(key) for key in expected} == expected, f"the launcher was handed {request}, not {expected}"
        command, variables = request.get("command"), request.get("variables")
        assert isinstance(command, list) and session in command, f"the worker's program would not start under its session {session}: {command}"
        assert isinstance(variables, dict) and variables.get("JOURNAL_ENV") == "main" and variables.get("AGENT_JOURNAL_ACTIVE") == "1", \
            f"the worker's hooks would not reach environment main: {variables}"
