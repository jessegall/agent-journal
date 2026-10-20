import contextvars
import queue
import sys
import threading
import traceback
from typing import Callable


class Deferred:
    """Work the server does after it has replied: one worker thread, in order, never on a request's thread, each piece in the scope it was added in."""

    STOP = None
    BEHIND = 500
    """Pieces waiting past which work that may be left undone is no longer added, so a slow plugin never grows the queue without end."""
    TOLD_EVERY = 100

    def __init__(self) -> None:
        self._queue: queue.Queue = queue.Queue()
        self._thread: threading.Thread | None = None
        self.skipped = 0

    def start(self) -> None:
        self._thread = threading.Thread(target=self._work, name="deferred", daemon=True)
        self._thread.start()

    def add(self, work: Callable[[], None]) -> None:
        self._queue.put(lambda context=contextvars.copy_context(): context.run(work))

    def add_unless_behind(self, work: Callable[[], None], what: str) -> None:
        """Work that may be left undone, such as a plugin hearing an event after the reply: past BEHIND pieces waiting it is skipped, and the server's log says so, at the first and every hundredth."""
        if self.depth() < self.BEHIND:
            self.add(work)
            return
        if self.skipped % self.TOLD_EVERY == 0:
            sys.stderr.write(f"deferred work is {self.depth()} pieces behind: skipped {what} ({self.skipped + 1} skipped so far)\n")
        self.skipped += 1

    def depth(self) -> int:
        """The pieces waiting to run."""
        return self._queue.qsize()

    def stop(self) -> None:
        if self._thread:
            self._queue.put(self.STOP)
            self._thread.join()
            self._thread = None

    def drain(self) -> None:
        """Blocks until everything added so far has run."""
        self._queue.join()

    def _work(self) -> None:
        """A piece of work that fails is written to the server's log and the next one runs: the worker never dies with the queue behind it."""
        while (work := self._queue.get()) is not self.STOP:
            try:
                work()
            except Exception:
                sys.stderr.write(f"deferred work failed:\n{traceback.format_exc()}")
            finally:
                self._queue.task_done()
        self._queue.task_done()
