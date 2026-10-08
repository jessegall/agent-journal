import queue
import threading
from collections import deque
from contextlib import contextmanager
from typing import Callable

WORKERS = 2
LONGEST_HOLD = 0.5
Job = Callable[[], None]


class AfterAnswer:
    """Runs work left after an answer on a few threads that hold back while a hook is answered; jobs sharing a lane run in order."""

    def __init__(self, workers: int):
        self.workers = workers
        self.jobs: queue.SimpleQueue = queue.SimpleQueue()
        self.quiet = threading.Condition()
        self.hooks_answering = 0
        self.lanes: dict[str, deque[Job]] = {}

    @classmethod
    def started(cls, workers: int = WORKERS) -> "AfterAnswer":
        pool = cls(workers)
        for n in range(workers):
            threading.Thread(target=pool.work, name=f"after-answer-{n}", daemon=True).start()
        return pool

    def add(self, job: Job, lane: str) -> None:
        with self.quiet:
            if lane in self.lanes:
                self.lanes[lane].append(job)
                return
            self.lanes[lane] = deque()
        self.jobs.put((job, lane))

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
            job, lane = self.jobs.get()
            with self.quiet:
                self.quiet.wait_for(lambda: not self.hooks_answering, LONGEST_HOLD)
            try:
                job()
            finally:
                self.next_in(lane)

    def next_in(self, lane: str) -> None:
        with self.quiet:
            waiting = self.lanes[lane]
            if not waiting:
                del self.lanes[lane]
                return
            job = waiting.popleft()
        self.jobs.put((job, lane))
