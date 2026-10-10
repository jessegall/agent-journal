import os
import queue
import threading
from collections import Counter, deque
from contextlib import contextmanager
from typing import Callable

WORKERS = max(4, os.cpu_count() or 4)
LONGEST_HOLD = 0.5
Job = Callable[[], None]
UNNAMED = ""
ANSWERING = threading.local()


class AfterAnswer:
    """Runs work left after an answer on a pool of threads; a job holds back while a hook of its own lane, or one not yet named, is answered; jobs sharing a lane run in order."""

    def __init__(self, workers: int):
        self.workers = workers
        self.jobs: queue.SimpleQueue = queue.SimpleQueue()
        self.quiet = threading.Condition()
        self.answering: Counter[str] = Counter()
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
            self.answering[UNNAMED] += 1
        ANSWERING.lane, ANSWERING.pool = UNNAMED, self
        try:
            yield
        finally:
            with self.quiet:
                self.answering[ANSWERING.lane] -= 1
                self.quiet.notify_all()
            ANSWERING.pool = None

    def named(self, lane: str) -> None:
        with self.quiet:
            self.answering[ANSWERING.lane] -= 1
            self.answering[lane] += 1
            ANSWERING.lane = lane
            self.quiet.notify_all()

    def held(self, lane: str) -> bool:
        return self.answering[UNNAMED] > 0 or self.answering[lane] > 0

    def work(self) -> None:
        while True:
            job, lane = self.jobs.get()
            with self.quiet:
                self.quiet.wait_for(lambda: not self.held(lane), LONGEST_HOLD)
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


def answering_for(lane: str) -> None:
    """Names the session whose hook this thread answers, so only that session's left-behind work waits for it."""
    pool = getattr(ANSWERING, "pool", None)
    if pool is not None:
        pool.named(lane)
