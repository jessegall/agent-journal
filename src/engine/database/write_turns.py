from abc import ABC, abstractmethod
from collections.abc import Generator
from contextlib import contextmanager

from engine.database.turn_depth import TurnDepth
from engine.execution.held_write_turn import HELD_WRITE_TURN


class WriteTurns(ABC):
    """The turn a write waits for before it takes the database's one write lock. A thread that has the turn
    and asks again, as a savepoint or a nested write does, goes on at once and gives it back at its outer end."""

    def __init__(self) -> None:
        self.depth = TurnDepth()

    @contextmanager
    def write_turn(self) -> Generator[None]:
        depth = self.depth.count
        if depth == 0:
            self.acquire()
            HELD_WRITE_TURN.count += 1
        self.depth.count = depth + 1
        try:
            yield
        finally:
            self.depth.count = depth
            if depth == 0:
                HELD_WRITE_TURN.count -= 1
                self.release()

    @abstractmethod
    def acquire(self) -> None: ...

    @abstractmethod
    def release(self) -> None: ...

