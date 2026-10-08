import queue
import threading
from contextlib import contextmanager
from typing import Callable

WORKERS = 2
LONGEST_HOLD = 0.5


class AfterAnswer:
    """Runs the work a request leaves behind once it is answered, on a few threads that hold back while a hook is being answered."""

    def __init__(self, workers: int):
        self.workers = workers
        self.jobs: queue.SimpleQueue = queue.SimpleQueue()
        self.quiet = threading.Condition()
        self.hooks_answering = 0

    @classmethod
    def started(cls, workers: int = WORKERS) -> "AfterAnswer":
        pool = cls(workers)
        for n in range(workers):
            threading.Thread(target=pool.work, name=f"after-answer-{n}", daemon=True).start()
        return pool

    def add(self, job: Callable[[], None]) -> None:
        self.jobs.put(job)

    @contextmanager
    def answering_hook(self):
        with self.quiet:
            self.hooks_answering += 1
        try:
            yield
        finally:
            with self.quiet:
                self.hooks_answering -= 1
                self.quiet.notify_all()

    def work(self) -> None:
        while True:
            job = self.jobs.get()
            with self.quiet:
                self.quiet.wait_for(lambda: not self.hooks_answering, LONGEST_HOLD)
            job()
