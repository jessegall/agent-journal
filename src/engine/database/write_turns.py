from abc import ABC, abstractmethod
from collections.abc import Generator
from contextlib import contextmanager

from engine.database.turn_depth import TurnDepth


class WriteTurns(ABC):
    """The turn a write waits for before it takes the database's one write lock. A thread that holds the turn and
    asks again, as a savepoint or a nested write does, goes on at once and gives it back only at its outer end."""

    def __init__(self) -> None:
        self.depth = TurnDepth()

    @contextmanager
    def write_turn(self) -> Generator[None]:
        depth = self.depth.count
        if depth == 0:
            self.acquire()
        self.depth.count = depth + 1
        try:
            yield
        finally:
            self.depth.count = depth
            if depth == 0:
                self.release()

    @abstractmethod
    def acquire(self) -> None: ...

    @abstractmethod
    def release(self) -> None: ...


class NeverWaitingWriteTurns(WriteTurns):
    """Turns that hold nothing and never wait, for every process but the server: an install, or a command run
    while the server is stopped."""

    def acquire(self) -> None:
        return None

    def release(self) -> None:
        return None
