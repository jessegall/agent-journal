from collections import defaultdict
from typing import Callable

from v2.resources.base import Event

Listener = Callable[[Event, object], None]
ANY = "*"

_listeners: dict[str, list[tuple[str, Listener]]] = defaultdict(list)


def on(pattern: str, listener: Listener, feature: str = "") -> Callable[[], None]:
    entry = (feature, listener)
    _listeners[pattern].append(entry)

    def off() -> None:
        _listeners[pattern].remove(entry)
    return off


def enabled(feature: str, record) -> bool:
    if not feature or record is None:
        return True
    return record.setting("features", {}).get(feature, True)


def emit(event: Event, record=None) -> None:
    for pattern in (ANY, event.type, event.action, f"{event.type}.{event.action}"):
        for feature, listener in list(_listeners.get(pattern, ())):
            if enabled(feature, record):
                listener(event, record)


def clear() -> None:
    _listeners.clear()
