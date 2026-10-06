import cProfile
import time
from contextlib import contextmanager
from dataclasses import dataclass, field

from engine import bus, runtime, waits
from engine.collecting import collecting
from engine.record import Record
from resources.base import SYSTEM

TIMING = "timing"
MEASURED = "measured"
EVENT = f"{TIMING}.{MEASURED}"
PROFILING = runtime.flag("profile-requests")


@dataclass(frozen=True)
class Lap:
    took: float
    working: float


@dataclass(frozen=True)
class Stopwatch:
    wall: float = field(default_factory=time.perf_counter)
    working: float = field(default_factory=time.thread_time)
    garbage: float = field(default_factory=collecting)
    waiting: float = field(default_factory=waits.total)

    def lap(self) -> Lap:
        return Lap((time.perf_counter() - self.wall) * 1000, (time.thread_time() - self.working) * 1000)

    def announce(self, record: Record, kind: str, name: str, profile: cProfile.Profile | None = None, answered: Lap | None = None) -> None:
        if not bus.heard(EVENT):
            return
        total = self.lap()
        answer = answered if answered else total
        bus.announce(None, TIMING, 0, MEASURED, SYSTEM, {
            "root": str(record.root), "env": record.env, "kind": kind, "target": name, "profile": profile,
            "took": answer.took, "working": answer.working, "after": total.took - answer.took,
            "garbage": (collecting() - self.garbage) * 1000, "waiting": waits.total() - self.waiting})


def profiler(root) -> cProfile.Profile | None:
    return cProfile.Profile() if bus.heard(EVENT) and PROFILING.is_raised(root) else None


@contextmanager
def measured(record: Record, kind: str, name: str):
    began = Stopwatch()
    try:
        yield
    finally:
        began.announce(record, kind, name)
