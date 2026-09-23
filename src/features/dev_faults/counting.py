import sys
import threading
from contextlib import contextmanager
from dataclasses import dataclass, field

KINDS = {"open": "opened", "os.scandir": "scanned", "os.listdir": "scanned"}
ACTIVE = threading.local()
INSTALLED = []


@dataclass
class Work:
    opened: list = field(default_factory=list)
    scanned: list = field(default_factory=list)


def recorded(event: str, args: tuple) -> None:
    work = getattr(ACTIVE, "work", None)
    if work is not None and event in KINDS:
        getattr(work, KINDS[event]).append(str(args[0]))


@contextmanager
def counted():
    if not INSTALLED:
        sys.addaudithook(recorded)
        INSTALLED.append(recorded)
    ACTIVE.work = Work()
    try:
        yield ACTIVE.work
    finally:
        ACTIVE.work = None
