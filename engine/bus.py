from collections import defaultdict
from typing import Callable

from resources.base import Event

Listener = Callable[[Event, object], None]
ANY = "*"

_listeners: dict[str, list[tuple[str, Listener]]] = defaultdict(list)


def always(record) -> bool:
    return True


def on(pattern: str, listener: Listener, enabled: Callable = always) -> Callable[[], None]:
    entry = (enabled, listener)
    _listeners[pattern].append(entry)

    def off() -> None:
        _listeners[pattern].remove(entry)
    return off


def emit(event: Event, record=None) -> None:
    for pattern in (ANY, event.type, event.action, f"{event.type}.{event.action}"):
        for enabled, listener in list(_listeners.get(pattern, ())):
            if record is None or enabled(record):
                listener(event, record)


def clear() -> None:
    _listeners.clear()
