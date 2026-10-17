import hashlib
import json
import os
import re
import socket
from collections.abc import Callable
from pathlib import Path

LONGEST = 1 << 20
PROTOCOL = 1
WAIT = 2.0
"""How long a request may take to arrive in whole once its connection is taken."""


class Inbox:
    """A unix socket the journal asks through, one per supervisor: a request is a line of JSON and its answer one line back. The socket lives in a folder only its user can open; while it is open, the project's runtime folder names it and the protocol it speaks."""

    def __init__(self, path: Path, announced_at: Path) -> None:
        self.path, self.announced_at = path, announced_at
        self._socket: socket.socket | None = None

    @classmethod
    def for_(cls, root: Path, environment: str) -> "Inbox":
        key = hashlib.sha1(str(root.resolve()).encode()).hexdigest()[:12]
        slug = re.sub(r"[^A-Za-z0-9_-]", "-", environment)[:24]
        return cls(Path("/tmp") / f"journal-{os.getuid()}" / f"{key}-{slug}.sock", root / ".journal" / "runtime" / "inboxes" / environment)

    @property
    def fd(self) -> int:
        return self._socket.fileno()

    def open(self) -> None:
        self.path.parent.mkdir(mode=0o700, exist_ok=True)
        self.path.parent.chmod(0o700)
        self.path.unlink(missing_ok=True)
        self._socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self._socket.bind(str(self.path))
        self.path.chmod(0o600)
        self._socket.listen(8)
        self._socket.setblocking(False)
        self.announced_at.parent.mkdir(parents=True, exist_ok=True)
        self.announced_at.write_text(json.dumps({"socket": str(self.path), "protocol": PROTOCOL}))

    def answer(self, handle: Callable[[dict], dict]) -> None:
        """Every request waiting, each answered on its own connection."""
        while True:
            try:
                connection, _ = self._socket.accept()
            except BlockingIOError:
                return
            with connection:
                connection.settimeout(WAIT)
                reply = self.handled(connection, handle)
                try:
                    connection.sendall((json.dumps(reply) + "\n").encode())
                except OSError:
                    continue

    @staticmethod
    def handled(connection: socket.socket, handle: Callable[[dict], dict]) -> dict:
        """The request's answer; one that is no JSON object, or that did not arrive in time, is answered with why."""
        try:
            request = json.loads(connection.makefile("rb").readline(LONGEST))
        except (ValueError, OSError) as fault:
            return {"ok": False, "error": f"the request is no line of JSON: {fault}"}
        if not isinstance(request, dict):
            return {"ok": False, "error": "the request is no JSON object"}
        return handle(request)

    def close(self) -> None:
        if self._socket:
            self._socket.close()
        self.path.unlink(missing_ok=True)
        self.announced_at.unlink(missing_ok=True)
