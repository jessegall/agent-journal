import threading
from functools import wraps
from collections import defaultdict
from contextlib import contextmanager
from typing import Callable

from resources.base import Event

Listener = Callable[[Event, object], None]
ANY = "*"

_listeners: dict[str, list[tuple[str, Listener]]] = defaultdict(list)
_watchers: list[Listener] = []
_held = threading.local()
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
    queue = getattr(_held, "queue", None)
    if queue is not None:
        queue.append((event, record))
        return
    run(event, record)


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


def run(event: Event, record=None) -> None:
    tell_watchers(event, record)
    before = cause()
    _cause.actor = event.data.get("cause") or event.actor
    try:
        for pattern in (ANY, event.type, event.action, f"{event.type}.{event.action}", event.data.get("event") or ""):
            for enabled, listener in list(_listeners.get(pattern, ())):
                if record is None or enabled(record):
                    listener(event, record)
    finally:
        _cause.actor = before


@contextmanager
def held():
    _held.queue = []
    try:
        yield _held.queue
    finally:
        _held.queue = None


def defer(job: Callable[[], None]) -> None:
    queue = getattr(_held, "queue", None)
    if queue is None:
        job()
        return
    queue.append((job, None))


def release(queue: list) -> None:
    for item, record in queue:
        if callable(item):
            item()
            continue
        emit(item, record)


def listening() -> bool:
    return any(_listeners.values())


def clear() -> None:
    _listeners.clear()
    _watchers.clear()
