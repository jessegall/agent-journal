import threading
from collections.abc import Callable, Iterator
from contextlib import contextmanager

from journal.support.rejection import Rejection


class ClockOutsRunning:
    """The workers whose clock-out runs now in this server: a second clock-out of the same worker is refused at once while the first runs, and the mark goes however the first ends."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.workers: set[int] = set()

    @contextmanager
    def held(self, worker: int, refusal: Callable[[], str]) -> Iterator[None]:
        with self.lock:
            busy = worker in self.workers
            self.workers.add(worker)
        if busy:
            raise Rejection(refusal())
        try:
            yield
        finally:
            with self.lock:
                self.workers.discard(worker)

    def is_running(self, worker: int) -> bool:
        with self.lock:
            return worker in self.workers
