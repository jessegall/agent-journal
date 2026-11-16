import sys
from pathlib import Path
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar

from engine.file.file_calls import FileCalls
DOOR_FOLDER = str(Path(__file__).resolve().parent) + "/"
SOURCE_ROOT = str(Path(__file__).resolve().parents[2]) + "/"
CALLER_DEPTH = 8


ACTIVE_COUNTS: ContextVar[FileCalls | None] = ContextVar("file_tally", default=None)


class FileTally:
    """Counts the file system calls made while a hook or a request is answered, so a hook that walks a folder shows
    what it cost, and where, the way its database points do."""

    @staticmethod
    @contextmanager
    def counting() -> Iterator[FileCalls]:
        calls = FileCalls()
        token = ACTIVE_COUNTS.set(calls)
        try:
            yield calls
        finally:
            ACTIVE_COUNTS.reset(token)

    @staticmethod
    def note(operation: str, amount: int = 1) -> None:
        calls = ACTIVE_COUNTS.get()
        if calls is None:
            return
        calls.operation_counts[operation] += amount
        calls.origins[FileTally.caller()] += amount

    # the first code line above the file door, which is where the call was asked for
    @staticmethod
    def caller() -> str:
        stack_entry = sys._getframe(2)
        for _ in range(CALLER_DEPTH):
            if stack_entry is None or not stack_entry.f_code.co_filename.startswith(DOOR_FOLDER):
                break
            stack_entry = stack_entry.f_back
        if stack_entry is None:
            return "unknown"
        return f"{stack_entry.f_code.co_filename.removeprefix(SOURCE_ROOT)}:{stack_entry.f_lineno}"
