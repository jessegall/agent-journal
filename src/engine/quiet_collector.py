import gc
import threading
import time
from contextlib import contextmanager
from typing import Callable

YOUNG_AFTER = 20_000
LONGEST_BUSY = 2.0
WHOLE_EVERY = 60.0
TICK = 0.2


class QuietCollector:
    """Collects garbage between requests, never during one, and freezes what a full collection leaves so the next walks only what is new."""

    def __init__(self, clock: Callable[[], float] = time.monotonic):
        self.clock = clock
        self.guard = threading.Lock()
        self.serving_now = 0
        self.waiting_since = 0.0
        self.whole_at = clock()

    @contextmanager
    def serving(self):
        with self.guard:
            self.serving_now += 1
        try:
            yield
        finally:
            with self.guard:
                self.serving_now -= 1

    def due(self, now: float, young: int) -> tuple[int, ...]:
        wanted = self.wanted(now, young)
        if not wanted:
            self.waiting_since = 0.0
            return ()
        if not self.serving_now:
            return wanted
        self.waiting_since = self.waiting_since or now
        return wanted if now - self.waiting_since >= LONGEST_BUSY else ()

    def wanted(self, now: float, young: int) -> tuple[int, ...]:
        if now - self.whole_at >= WHOLE_EVERY:
            return (2,)
        if young >= YOUNG_AFTER:
            return (1,)
        return ()

    def collect(self, generation: int) -> None:
        gc.collect(generation)
        self.waiting_since = 0.0
        if generation == 2:
            self.whole_at = self.clock()
            gc.freeze()

    def run(self, halting: threading.Event) -> None:
        gc.disable()
        while not halting.wait(TICK):
            for generation in self.due(self.clock(), gc.get_count()[0]):
                self.collect(generation)
