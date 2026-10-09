import cProfile
import sys
import threading
import time
import traceback
from contextlib import contextmanager
from dataclasses import dataclass, field

from engine import bus, runtime, waits, whole_reads
from engine.collecting import collecting
from engine.record import Record
from resources.base import SYSTEM

TIMING = "timing"
MEASURED = "measured"
EVENT = f"{TIMING}.{MEASURED}"
PROFILING = runtime.flag("profile-requests")
SAMPLE_AFTER = 0.05
MOST_SAMPLES = 3
STACK_DEPTH = 14
STACKS_KEPT = 16000


class Sampler:
    """While a request runs past SAMPLE_AFTER, records where every thread is, so a slow request shows what else held the Python lock."""

    def __init__(self):
        self.taken: list[str] = []
        self.timer: threading.Timer | None = None
        self.mine = threading.get_ident()

    def start(self) -> None:
        self._arm()

    def stop(self) -> str:
        if self.timer:
            self.timer.cancel()
        return "\n".join(self.taken)[:STACKS_KEPT]

    def _arm(self) -> None:
        self.timer = threading.Timer(SAMPLE_AFTER, self._sample)
        self.timer.daemon = True
        self.timer.start()

    def _sample(self) -> None:
        names = {thread.ident: thread.name for thread in threading.enumerate()}
        threads = [f"thread {names.get(ident, ident)}{' (this request)' if ident == self.mine else ''}:\n{''.join(traceback.format_stack(frame, STACK_DEPTH))}"
                   for ident, frame in sys._current_frames().items() if ident != threading.get_ident()]
        self.taken.append(f"--- {len(self.taken) + 1} x {SAMPLE_AFTER * 1000:.0f}ms into the request ---\n" + "\n".join(threads))
        if len(self.taken) < MOST_SAMPLES:
            self._arm()


@dataclass(frozen=True)
class Lap:
    took: float
    working: float
    waiting: float
    whole_reads: tuple[str, ...] = ()


@dataclass(frozen=True)
class Stopwatch:
    wall: float = field(default_factory=time.perf_counter)
    working: float = field(default_factory=time.thread_time)
    garbage: float = field(default_factory=collecting)
    waiting: float = field(default_factory=waits.total)
    read_whole: int = field(default_factory=whole_reads.count)

    def lap(self) -> Lap:
        return Lap((time.perf_counter() - self.wall) * 1000, (time.thread_time() - self.working) * 1000, waits.total() - self.waiting,
                   whole_reads.since(self.read_whole))

    def announce(self, record: Record, kind: str, name: str, profile: cProfile.Profile | None = None, answered: Lap | None = None, stacks: str = "", after: float = 0.0) -> None:
        if not bus.heard(EVENT):
            return
        total = self.lap()
        answer = answered if answered else total
        bus.announce(None, TIMING, 0, MEASURED, SYSTEM, {
            "root": str(record.root), "env": record.env, "kind": kind, "target": name, "profile": profile, "stacks": stacks,
            "took": answer.took, "working": answer.working, "after": after,
            "garbage": (collecting() - self.garbage) * 1000, "waiting": answer.waiting,
            "whole_reads": list(answer.whole_reads)})


def profiler(root) -> cProfile.Profile | None:
    return cProfile.Profile() if bus.heard(EVENT) and PROFILING.is_raised(root) else None


@contextmanager
def measured(record: Record, kind: str, name: str):
    began = Stopwatch()
    try:
        yield
    finally:
        began.announce(record, kind, name)
