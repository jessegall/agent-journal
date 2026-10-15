import hashlib
import re
import socket
from pathlib import Path

from supervisor.instructions.instruction import Instruction

LARGEST = 1 << 16


class Inbox:
    """A unix socket the journal writes to, one per environment; each datagram is one instruction. While open, the project's runtime folder names it, so the journal finds the agent of each environment."""

    def __init__(self, path: Path, announced_at: Path) -> None:
        self.path, self.announced_at = path, announced_at
        self._socket: socket.socket | None = None

    @classmethod
    def for_(cls, root: Path, environment: str) -> "Inbox":
        key = hashlib.sha1(str(root.resolve()).encode()).hexdigest()[:12]
        slug = re.sub(r"[^A-Za-z0-9_-]", "-", environment)[:24]
        return cls(Path("/tmp") / f"journal-{key}-{slug}.sock", root / ".journal" / "runtime" / "inboxes" / environment)

    @property
    def fd(self) -> int:
        return self._socket.fileno()

    def open(self) -> None:
        self.path.unlink(missing_ok=True)
        self._socket = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
        self._socket.bind(str(self.path))
        self._socket.setblocking(False)
        self.announced_at.parent.mkdir(parents=True, exist_ok=True)
        self.announced_at.write_text(str(self.path))

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
        self.announced_at.unlink(missing_ok=True)
