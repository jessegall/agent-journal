import json
import socket
from collections.abc import Mapping

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome

ANSWER_LIMIT_SECONDS = 9
ANSWER_BYTES = 32
STOPPED_ANSWER = b"stopped\n"
STOP_FIELD = "stop"


class LauncherLink:
    """Hands the running launcher a request on its socket; with an answer asked for, gives what it answered,
    and gives nothing when it could not be reached."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def is_running(self) -> bool:
        return self.home.socket(LAUNCHER_SOCKET).exists()

    def stop(self, agent_id: int) -> bool:
        return self.sent({"agent_id": agent_id, STOP_FIELD: True}, ANSWER_BYTES) == STOPPED_ANSWER

    def request_stop(self, agent_id: int) -> None:
        self.sent({"agent_id": agent_id, STOP_FIELD: True})

    def sent(self, request: Mapping[str, object], answer_bytes: int = 0) -> bytes | None:
        path = self.home.socket(LAUNCHER_SOCKET)
        if not path.exists():
            return None
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
            connection.settimeout(ANSWER_LIMIT_SECONDS)
            try:
                connection.connect(str(path))
                connection.sendall((json.dumps(request) + "\n").encode())
                return connection.recv(answer_bytes) if answer_bytes else b""
            except OSError:
                return None
