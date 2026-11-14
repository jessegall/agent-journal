from collections import Counter
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar

ACTIVE_TALLY: ContextVar[Counter[str] | None] = ContextVar("file_tally", default=None)


class FileTally:
    """Counts the file system calls made while a hook or a request is answered, by kind: a check, a read and an
    entry listed, so a hook that walks a folder shows what it cost the way its database points do."""

    @staticmethod
    @contextmanager
    def counting() -> Iterator[Counter[str]]:
        counts: Counter[str] = Counter()
        token = ACTIVE_TALLY.set(counts)
        try:
            yield counts
        finally:
            ACTIVE_TALLY.reset(token)

    @staticmethod
    def note(kind: str, amount: int = 1) -> None:
        counts = ACTIVE_TALLY.get()
        if counts is not None:
            counts[kind] += amount
