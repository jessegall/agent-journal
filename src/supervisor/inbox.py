import json
import socket
from collections.abc import Callable
from pathlib import Path

from supervisor.reply import Reply
from supervisor.request import Request

LONGEST = 1 << 20
PROTOCOL = 1
WAIT_SECONDS = 2.0


class Inbox:
    """A unix socket the journal asks through, one per supervisor: a request is a line of JSON and its answer one line back. The socket lives in a folder only its user can open; while it is open, the announce file names it and the protocol it speaks."""

    def __init__(self, path: Path, announced_at: Path) -> None:
        self.path, self.announced_at = path, announced_at
        self._socket: socket.socket | None = None

    @property
    def fd(self) -> int:
        return self._socket.fileno()

    def open(self) -> None:
        self.announce({})

    def open_mirrored(self, screen: Path) -> None:
        self.announce({"screen": str(screen)})

    def announce(self, fields: dict[str, str]) -> None:
        self.path.parent.mkdir(mode=0o700, exist_ok=True)
        self.path.parent.chmod(0o700)
        self.path.unlink(missing_ok=True)
        self._socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self._socket.bind(str(self.path))
        self.path.chmod(0o600)
        self._socket.listen(8)
        self._socket.setblocking(False)
        self.announced_at.parent.mkdir(parents=True, exist_ok=True)
        self.announced_at.write_text(json.dumps({"socket": str(self.path), "protocol": PROTOCOL, **fields}))

    def answer(self, handle: Callable[[Request], Reply]) -> None:
        while True:
            try:
                connection, _ = self._socket.accept()
            except BlockingIOError:
                return
            with connection:
                connection.settimeout(WAIT_SECONDS)
                reply = self.handled(connection, handle)
                try:
                    connection.sendall((json.dumps(reply.as_json()) + "\n").encode())
                except OSError:
                    continue

    @staticmethod
    def handled(connection: socket.socket, handle: Callable[[Request], Reply]) -> Reply:
        try:
            payload = json.loads(connection.makefile("rb").readline(LONGEST))
        except (ValueError, OSError) as fault:
            return Reply.refused(f"the request is no line of JSON: {fault}")
        if not isinstance(payload, dict):
            return Reply.refused("the request is no JSON object")
        return handle(Request.parsed(payload))

    def close(self) -> None:
        if self._socket:
            self._socket.close()
        self.path.unlink(missing_ok=True)
        self.announced_at.unlink(missing_ok=True)
