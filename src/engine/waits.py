import threading
import time
from contextlib import contextmanager

class Spent(threading.local):
    def __init__(self):
        self.waits: dict[str, float] = {}


_spent = Spent()


def totals() -> dict[str, float]:
    return _spent.waits


def total() -> float:
    return sum(totals().values())


@contextmanager
def waited(name: str):
    began = time.perf_counter()
    try:
        yield
    finally:
        spent = totals()
        spent[name] = spent.get(name, 0.0) + (time.perf_counter() - began) * 1000


class Lock:
    def __init__(self, name: str, lock=None):
        self.name = name
        self.lock = lock or threading.Lock()

    def __enter__(self) -> "Lock":
        with waited(self.name):
            self.lock.acquire()
        return self

    def __exit__(self, *raised) -> None:
        self.lock.release()
