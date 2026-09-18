from collections import defaultdict
from typing import Callable

from v2.resources.base import Event

Listener = Callable[[Event], None]
ANY = "*"

_listeners: dict[str, list[Listener]] = defaultdict(list)


def on(pattern: str, listener: Listener) -> Callable[[], None]:
    _listeners[pattern].append(listener)

    def off() -> None:
        _listeners[pattern].remove(listener)
    return off


def emit(event: Event) -> None:
    for pattern in (ANY, event.type, event.action, f"{event.type}.{event.action}"):
        for listener in list(_listeners.get(pattern, ())):
            listener(event)


def clear() -> None:
    _listeners.clear()
