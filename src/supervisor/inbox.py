import hashlib
import socket
from pathlib import Path

from supervisor.instructions.instruction import Instruction

LARGEST = 1 << 16


class Inbox:
    """A unix socket the journal writes to; each datagram is one instruction."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self._socket: socket.socket | None = None

    @property
    def fd(self) -> int:
        return self._socket.fileno()

    def open(self) -> None:
        self.path.unlink(missing_ok=True)
        self._socket = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
        self._socket.bind(str(self.path))
        self._socket.setblocking(False)

    def received(self) -> list[Instruction]:
        found = []
        while True:
            try:
                found.append(Instruction.parse(self._socket.recv(LARGEST)))
            except BlockingIOError:
                return found
            except (ValueError, KeyError):
                continue

    def close(self) -> None:
        if self._socket:
            self._socket.close()
        self.path.unlink(missing_ok=True)

    @staticmethod
    def path_for(root: Path) -> Path:
        return Path("/tmp") / f"journal-{hashlib.sha1(str(root.resolve()).encode()).hexdigest()[:16]}.sock"
