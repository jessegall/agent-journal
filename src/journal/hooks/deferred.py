import queue
import threading
from typing import Callable


class Deferred:
    """Work the server does after it has replied: one worker thread, in order, never on a request's thread."""

    STOP = None

    def __init__(self) -> None:
        self._queue: queue.Queue = queue.Queue()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        self._thread = threading.Thread(target=self._work, name="deferred", daemon=True)
        self._thread.start()

    def add(self, work: Callable[[], None]) -> None:
        self._queue.put(work)

    def stop(self) -> None:
        if self._thread:
            self._queue.put(self.STOP)
            self._thread.join()
            self._thread = None

    def drain(self) -> None:
        """Blocks until everything added so far has run."""
        self._queue.join()

    def _work(self) -> None:
        while (work := self._queue.get()) is not self.STOP:
            try:
                work()
            finally:
                self._queue.task_done()
        self._queue.task_done()
