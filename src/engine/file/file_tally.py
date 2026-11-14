import sys
from pathlib import Path
from collections import Counter
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass, field

DOOR_FOLDER = str(Path(__file__).resolve().parent) + "/"
SOURCE_ROOT = str(Path(__file__).resolve().parents[2]) + "/"
CALLER_DEPTH = 8


@dataclass(frozen=True)
class FileCalls:
    """The file system calls of one hook or request: how many of each kind, a check, a read and an entry listed,
    and the code line outside the file door that made them."""

    kinds: Counter[str] = field(default_factory=Counter)
    origins: Counter[str] = field(default_factory=Counter)

    @property
    def total(self) -> int:
        return sum(self.kinds.values())


ACTIVE_TALLY: ContextVar[FileCalls | None] = ContextVar("file_tally", default=None)


class FileTally:
    """Counts the file system calls made while a hook or a request is answered, so a hook that walks a folder shows
    what it cost, and where, the way its database points do."""

    @staticmethod
    @contextmanager
    def counting() -> Iterator[FileCalls]:
        calls = FileCalls()
        token = ACTIVE_TALLY.set(calls)
        try:
            yield calls
        finally:
            ACTIVE_TALLY.reset(token)

    @staticmethod
    def note(kind: str, amount: int = 1) -> None:
        calls = ACTIVE_TALLY.get()
        if calls is None:
            return
        calls.kinds[kind] += amount
        calls.origins[FileTally.caller()] += amount

    # the first code line above the file door, which is where the call was asked for
    @staticmethod
    def caller() -> str:
        frame = sys._getframe(2)
        for _ in range(CALLER_DEPTH):
            if frame is None or not frame.f_code.co_filename.startswith(DOOR_FOLDER):
                break
            frame = frame.f_back
        if frame is None:
            return "unknown"
        return f"{frame.f_code.co_filename.removeprefix(SOURCE_ROOT)}:{frame.f_lineno}"
