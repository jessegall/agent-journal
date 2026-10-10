import threading
import time
import traceback
from functools import wraps
from collections import defaultdict
from contextlib import contextmanager
from typing import Callable

from engine.transaction import WORK, undoable
from resources.base import Event

Listener = Callable[[Event, object], None]
ANY = "*"

_listeners: dict[str, list[tuple[str, Listener]]] = defaultdict(list)
_watchers: list[Listener] = []
_cause = threading.local()
_command = threading.local()


def always(record) -> bool:
    return True


def on(pattern: str, listener: Listener, enabled: Callable = always) -> Callable[[], None]:
    entry = (enabled, listener)
    _listeners[pattern].append(entry)

    def off() -> None:
        _listeners[pattern].remove(entry)
    return off


def watch(watcher: Listener) -> Callable[[], None]:
    _watchers.append(watcher)
    return lambda: _watchers.remove(watcher)


def tell_watchers(event: Event, record=None) -> None:
    for watcher in list(_watchers):
        watcher(event, record)


def emit(event: Event, record=None) -> None:
    if WORK.bus_queue is not None:
        WORK.bus_queue.append((event, record))
        return
    run(event, record)


def announce(record, type: str, n: int, action: str, actor: str, data: dict | None = None, at: float | None = None) -> None:
    emit(Event(0, time.time() if at is None else at, type, n, action, actor, data or {}), record)


def commanded(type_: str, name: str, fn):
    @wraps(fn)
    def run_command(*args, **kwargs):
        if getattr(_command, "word", None):
            return fn(*args, **kwargs)
        _command.word = (type_, name)
        try:
            return fn(*args, **kwargs)
        finally:
            _command.word = None
    return run_command


def command(type_: str) -> str:
    word = getattr(_command, "word", None)
    return word[1] if word and word[0] == type_ else ""


def cause() -> str:
    return getattr(_cause, "actor", "")


def patterns(event) -> tuple[str, ...]:
    return (ANY, event.type, event.action, f"{event.type}.{event.action}", event.data.get("event") or "", f"hook.{event.data.get('hook')}" if event.data.get("hook") else "", "hook.*" if event.data.get("hook") else "")


def run(event: Event, record=None) -> None:
    tell_watchers(event, record)
    before = cause()
    _cause.actor = event.data.get("cause") or event.actor
    try:
        for pattern in patterns(event):
            for enabled, listener in list(_listeners.get(pattern, ())):
                if record is None or enabled(record):
                    listener(event, record)
    finally:
        _cause.actor = before


@contextmanager
def held():
    previous, WORK.bus_queue = WORK.bus_queue, []
    try:
        yield WORK.bus_queue
    finally:
        WORK.bus_queue = previous


@contextmanager
def settled():
    if WORK.bus_queue is not None:
        yield
        return
    queue: list = []
    try:
        with held() as queue:
            yield
    finally:
        release(queue)


@contextmanager
def unit():
    with settled(), undoable():
        yield


def defer(job: Callable[[], None]) -> None:
    if WORK.bus_queue is None:
        job()
        return
    WORK.bus_queue.append((job, None))


def defer_once(key: str, job: Callable[[], None]) -> None:
    queue, after = WORK.bus_queue, WORK.bus_after
    if queue is not None:
        if key not in (held for item, held in queue if callable(item)):
            queue.append((job, key))
        return
    if after is not None:
        after.setdefault(key, job)
        return
    job()


BACKGROUND = True
_waiting: dict[str, Callable[[], None]] = {}
_worker: threading.Thread | None = None
_worker_lock = threading.Lock()


def background(key: str, job: Callable[[], None]) -> None:
    """Runs work nobody waits for on a thread of its own, once per key if it is asked for again before it started, so the request that asked for it is not held up by it; with the thread switched off it runs at once."""
    global _worker
    if not BACKGROUND:
        job()
        return
    with _worker_lock:
        _waiting[key] = job
        if _worker is not None and _worker.is_alive():
            return
        _worker = threading.Thread(target=_work_through, daemon=True)
        _worker.start()


def _work_through() -> None:
    while True:
        with _worker_lock:
            if not _waiting:
                return
            key = next(iter(_waiting))
            job = _waiting.pop(key)
        try:
            job()
        except Exception:
            traceback.print_exc()


def release(queue: list) -> None:
    previous, WORK.bus_after = WORK.bus_after, {}
    try:
        for item, record in queue:
            if callable(item):
                item()
                continue
            emit(item, record)
    finally:
        after, WORK.bus_after = WORK.bus_after, previous
    for job in after.values():
        job()


def listening() -> bool:
    return any(_listeners.values())


def heard(pattern: str) -> bool:
    return bool(_listeners.get(pattern))


def clear() -> None:
    _listeners.clear()
    _watchers.clear()
