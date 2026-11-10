import os
import sys
from collections.abc import Generator
from contextlib import contextmanager
from contextvars import ContextVar
from functools import cache

from engine.command.dry_run_reached_effect import DryRunReachedEffect
from engine.database.repeated_work import OPEN_REQUEST

DRY_RUN: ContextVar[bool] = ContextVar("dry_run", default=False)
OPEN_FLAGS = os.O_WRONLY | os.O_RDWR | os.O_CREAT | os.O_APPEND | os.O_TRUNC
EFFECT_EVENTS = frozenset({
    "os.remove", "os.rename", "os.rmdir", "os.mkdir", "os.truncate", "os.symlink", "os.link", "os.chmod", "os.chown", "os.utime",
    "shutil.copyfile", "shutil.copymode", "shutil.copystat", "shutil.copytree", "shutil.rmtree", "shutil.move", "shutil.chown",
    "tempfile.mkstemp", "tempfile.mkdtemp", "subprocess.Popen", "os.system", "os.posix_spawn", "os.exec", "os.fork",
    "socket.connect", "socket.sendto", "socket.sendmsg",
})


def audited(event: str, details: tuple[object, ...]) -> None:
    if not DRY_RUN.get():
        return None
    if event in EFFECT_EVENTS or (event == "open" and isinstance(details[2], int) and details[2] & OPEN_FLAGS):
        raise DryRunReachedEffect(event)


@cache
def watch_effects() -> None:
    sys.addaudithook(audited)


@contextmanager
def dry_run() -> Generator[None]:
    watch_effects()
    uncounted, running = OPEN_REQUEST.set(None), DRY_RUN.set(True)
    try:
        yield
    finally:
        DRY_RUN.reset(running)
        OPEN_REQUEST.reset(uncounted)
