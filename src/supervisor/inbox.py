import socket
from pathlib import Path

from supervisor.instruction import Instruction


class Inbox:
    """A unix socket the journal writes to; each datagram is one instruction."""

    def __init__(self, path: Path) -> None: ...

    @property
    def fd(self) -> int: ...

    def open(self) -> None: ...

    def received(self) -> list[Instruction]: ...

    def close(self) -> None: ...

    @staticmethod
    def path_for(root: Path) -> Path: ...
