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
SAMPLES_AT = (0.05, 0.2, 0.8)
TICK = 0.025
STACK_DEPTH = 14
STACKS_KEPT = 16000


class Sampling:
    """The one thread of a server that looks at every thread for the requests running slowly: it wakes every few milliseconds while one runs, takes one picture of all the threads for every request that has reached its next sample time, and sleeps while none runs."""

    def __init__(self):
        self.active: set["Sampler"] = set()
        self.guard = threading.Lock()
        self.awake = threading.Event()
        self.thread: threading.Thread | None = None

    def watch(self, sampler: "Sampler") -> None:
        with self.guard:
            self.active.add(sampler)
            if self.thread is None:
                self.thread = threading.Thread(target=self.run, name="sampler", daemon=True)
                self.thread.start()
        self.awake.set()

    def forget(self, sampler: "Sampler") -> None:
        with self.guard:
            self.active.discard(sampler)

    def run(self) -> None:
        while True:
            self.awake.wait()
            with self.guard:
                waiting = list(self.active)
            if not waiting:
                self.awake.clear()
                continue
            now = time.perf_counter()
            due = [one for one in waiting if one.due(now)]
            if due:
                pictured = {ident: frame for ident, frame in sys._current_frames().items() if ident != threading.get_ident()}
                names = {thread.ident: thread.name for thread in threading.enumerate()}
                for one in due:
                    one.take(pictured, names)
            time.sleep(TICK)



def unread_lines(summary: traceback.StackSummary) -> str:
    """A stack as its files, lines and functions only: formatting it with the source would open every file on it, inside the request being measured."""
    return "".join(f'  File "{frame.filename}", line {frame.lineno}, in {frame.name}\n' for frame in summary)


SAMPLING = Sampling()


class Sampler:
    """While a request runs past the first sample time, keeps where every thread was at the latest of its sample times, so a slow request shows what else held the Python lock."""

    def __init__(self):
        self.last: tuple[int, dict] | None = None
        self.began = 0.0
        self.mine = threading.get_ident()

    @property
    def taken(self) -> list:
        return [self.last] if self.last else []

    def start(self) -> None:
        self.began = time.perf_counter()
        SAMPLING.watch(self)

    def stop(self) -> str:
        SAMPLING.forget(self)
        if not self.last:
            return ""
        number, threads = self.last
        shown = [f"thread {name}{' (this request)' if ident == self.mine else ''}:\n{unread_lines(summary)}" for ident, (name, summary) in threads.items()]
        return (f"--- {number} x {SAMPLES_AT[number - 1] * 1000:.0f}ms into the request ---\n" + "\n".join(shown))[:STACKS_KEPT]

    def due(self, now: float) -> bool:
        number = self.last[0] if self.last else 0
        return number < len(SAMPLES_AT) and now - self.began >= SAMPLES_AT[number]

    def take(self, pictured: dict, names: dict) -> None:
        number = (self.last[0] if self.last else 0) + 1
        self.last = (number, {ident: (names.get(ident, ident), traceback.StackSummary.extract(traceback.walk_stack(frame), limit=STACK_DEPTH, lookup_lines=False))
                              for ident, frame in pictured.items()})


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


def reported(root, env: str, name: str, took: float) -> None:
    """A command the shim timed from its own start, which the server cannot: a curl that timed out, a cold rerun, a command that never reached the server's clock."""
    if bus.heard(EVENT):
        bus.announce(None, TIMING, 0, MEASURED, SYSTEM, {
            "root": str(root), "env": env, "kind": "command", "target": name, "profile": None, "stacks": "", "took": took, "working": 0.0, "after": 0.0,
            "garbage": 0.0, "waiting": 0.0, "whole_reads": []})
