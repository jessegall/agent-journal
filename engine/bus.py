import threading
from collections import defaultdict
from contextlib import contextmanager
from typing import Callable

from resources.base import Event

Listener = Callable[[Event, object], None]
ANY = "*"

_listeners: dict[str, list[tuple[str, Listener]]] = defaultdict(list)
_held = threading.local()


def always(record) -> bool:
    return True


def on(pattern: str, listener: Listener, enabled: Callable = always) -> Callable[[], None]:
    entry = (enabled, listener)
    _listeners[pattern].append(entry)

    def off() -> None:
        _listeners[pattern].remove(entry)
    return off


def emit(event: Event, record=None) -> None:
    queue = getattr(_held, "queue", None)
    if queue is not None:
        queue.append((event, record))
        return
    for pattern in (ANY, event.type, event.action, f"{event.type}.{event.action}"):
        for enabled, listener in list(_listeners.get(pattern, ())):
            if record is None or enabled(record):
                listener(event, record)


@contextmanager
def held():
    _held.queue = []
    try:
        yield _held.queue
    finally:
        _held.queue = None


def release(queue: list) -> None:
    for event, record in queue:
        emit(event, record)


def listening() -> bool:
    return any(_listeners.values())


def clear() -> None:
    _listeners.clear()
