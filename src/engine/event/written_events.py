import threading
from functools import cache

MOST_THREAD_KEYS = 64


class WrittenEvents:
    """The names of the events each thread wrote and has not taken yet, kept in the process: a thread takes only
    its own names after it committed, so a wake never takes the names of a write that has not committed yet."""

    def __init__(self) -> None:
        self.names: dict[int, set[str]] = {}
        self.lock = threading.Lock()

    @staticmethod
    @cache
    def shared() -> "WrittenEvents":
        return WrittenEvents()

    def add(self, name: str) -> None:
        with self.lock:
            self.names.setdefault(threading.get_ident(), set()).add(name)
            if len(self.names) > MOST_THREAD_KEYS:
                self.drop_ended_threads()

    def taken(self) -> frozenset[str]:
        with self.lock:
            return frozenset(self.names.pop(threading.get_ident(), set()))

    def drop_ended_threads(self) -> None:
        living = {thread.ident for thread in threading.enumerate()}
        for ident in [ident for ident in self.names if ident not in living]:
            del self.names[ident]
