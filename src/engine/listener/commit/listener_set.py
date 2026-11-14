import threading
from collections.abc import Sequence
from typing import Any, ClassVar

from engine.container.container import Container
from engine.listener.errors.listener_rebuilt_error import ListenerRebuiltError
from engine.registry.listener_entry import ListenerEntry
from engine.registry.registry import Registry


class ListenerSet:
    """The commit listeners of one thread, built once from one registry; building them again for the same
    thread and registry while this set is open is a fault."""

    built_sets: ClassVar[set[tuple[str, str]]] = set()
    guarded_threads: ClassVar[set[str]] = set()

    def __init__(self, thread_name: str, registry: Registry, container: Container, entries: Sequence[ListenerEntry]) -> None:
        self.key = (thread_name, registry.fingerprint)
        if self.key in ListenerSet.built_sets:
            raise ListenerRebuiltError(thread_name, registry.fingerprint)
        self.entries = tuple(entries)
        self.instances: dict[str, Any] = {entry.name: container.get(entry.path.loaded()) for entry in self.entries}
        ListenerSet.built_sets.add(self.key)
        self.event_matches: dict[str, bool] = {}

    def matches(self, event_name: str) -> bool:
        if event_name not in self.event_matches:
            self.event_matches[event_name] = any(entry.event.matches(event_name) for entry in self.entries)
        return self.event_matches[event_name]

    # the runner asks only for entries whose class it checked is a commit listener
    def instance(self, entry: ListenerEntry) -> Any:
        return self.instances[entry.name]

    # a server listener thread names itself, so its sets are held to one per registry; a runner in any other thread,
    # such as a test's or a command's, builds a set for its own container
    @staticmethod
    def guard_current_thread() -> None:
        ListenerSet.guarded_threads.add(threading.current_thread().name)

    @staticmethod
    def thread_name(container: Container) -> str:
        name = threading.current_thread().name
        return name if name in ListenerSet.guarded_threads else f"{name} for container {id(container)}"

    def close(self) -> None:
        ListenerSet.built_sets.discard(self.key)
