import json
import socket
from collections.abc import Mapping

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome

ANSWER_LIMIT_SECONDS = 5
ANSWER_BYTES = 16


class LauncherLink:
    """Hands the running launcher a request on its socket; with an answer asked for, gives what it answered,
    and gives nothing when it could not be reached."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

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
