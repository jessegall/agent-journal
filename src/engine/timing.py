import cProfile
import time
from contextlib import contextmanager
from dataclasses import dataclass, field

from engine import bus, runtime, waits
from engine.collecting import collecting
from resources.base import SYSTEM

TIMING = "timing"
MEASURED = "measured"
EVENT = f"{TIMING}.{MEASURED}"
PROFILING = runtime.flag("profile-requests")


@dataclass(frozen=True)
class Stopwatch:
    wall: float = field(default_factory=time.perf_counter)
    working: float = field(default_factory=time.thread_time)
    garbage: float = field(default_factory=collecting)
    waiting: float = field(default_factory=waits.total)

    def announce(self, root, env: str, kind: str, name: str, profile: cProfile.Profile | None = None) -> None:
        if not bus.heard(EVENT):
            return
        bus.announce(None, TIMING, 0, MEASURED, SYSTEM, {
            "root": str(root), "env": env, "kind": kind, "target": name,
            "took": (time.perf_counter() - self.wall) * 1000, "working": (time.thread_time() - self.working) * 1000,
            "garbage": (collecting() - self.garbage) * 1000, "waiting": waits.total() - self.waiting,
            **({"profile": profile} if profile else {})})


def profiler(root) -> cProfile.Profile | None:
    return cProfile.Profile() if bus.heard(EVENT) and PROFILING.is_raised(root) else None


@contextmanager
def measured(root, env: str, kind: str, name: str):
    began = Stopwatch()
    try:
        yield
    finally:
        began.announce(root, env, kind, name)
