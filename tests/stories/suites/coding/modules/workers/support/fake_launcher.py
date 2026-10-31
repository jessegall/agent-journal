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

    def expect_worker(self, worker_id: int, folder: Path) -> None:
        self.thread.join(ACCEPT_TIMEOUT_SECONDS)
        self.server.close()
        assert self.requests and self.requests[0].get("agent_id") == worker_id and self.requests[0].get("folder") == str(folder), \
            f"the launcher was handed {self.requests}, not worker {worker_id} in {folder}"
