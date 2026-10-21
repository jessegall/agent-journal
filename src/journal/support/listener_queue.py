import contextvars
import queue
import sys
import threading
import traceback
from typing import Callable


class ListenerQueue:
    """Work the server does after it has replied: one worker thread, in order, never on a request's thread, each piece in the scope it was added in."""

    STOP = None
    QUEUE_WARNING_LENGTH = 500
    LOG_INTERVAL = 100

    def __init__(self) -> None:
        self._queue: queue.Queue = queue.Queue()
        self._thread: threading.Thread | None = None
        self.skipped = 0

    def start(self) -> None:
        self._thread = threading.Thread(target=self._work, name="deferred", daemon=True)
        self._thread.start()

    def add(self, work: Callable[[], None]) -> None:
        self._queue.put(lambda context=contextvars.copy_context(): context.run(work))

    def add_bounded(self, work: Callable[[], None], subject: str) -> None:
        if self.depth() < self.QUEUE_WARNING_LENGTH:
            self.add(work)
            return
        if self.skipped % self.LOG_INTERVAL == 0:
            sys.stderr.write(f"deferred work is {self.depth()} pieces behind: skipped {subject} ({self.skipped + 1} skipped so far)\n")
        self.skipped += 1

    def depth(self) -> int:
        return self._queue.qsize()

    def stop(self) -> None:
        if self._thread:
            self._queue.put(self.STOP)
            self._thread.join()
            self._thread = None

    def drain(self) -> None:
        self._queue.join()

    def _work(self) -> None:
        while (work := self._queue.get()) is not self.STOP:
            try:
                work()
            except Exception:
                sys.stderr.write(f"deferred work failed:\n{traceback.format_exc()}")
            finally:
                self._queue.task_done()
        self._queue.task_done()
