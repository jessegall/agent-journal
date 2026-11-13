from collections.abc import Sequence
from typing import ClassVar

from engine.container.container import Container
from engine.listener.errors.listener_rebuilt_error import ListenerRebuiltError
from engine.registry.listener_entry import ListenerEntry
from engine.registry.registry import Registry


class ListenerSet:
    """The commit listeners of one thread, built once from one registry; building them again for the same
    thread and registry while this set is open is a fault."""

    built_sets: ClassVar[set[tuple[str, str]]] = set()

    def __init__(self, thread_name: str, registry: Registry, container: Container, entries: Sequence[ListenerEntry]) -> None:
        self.key = (thread_name, registry.fingerprint)
        if self.key in ListenerSet.built_sets:
            raise ListenerRebuiltError(thread_name, registry.fingerprint)
        ListenerSet.built_sets.add(self.key)
        self.entries = tuple(entries)
        self.instances = {entry.name: container.get(entry.path.loaded()) for entry in self.entries}
        self.event_matches: dict[str, bool] = {}

    def matches(self, event_name: str) -> bool:
        if event_name not in self.event_matches:
            self.event_matches[event_name] = any(entry.event.matches(event_name) for entry in self.entries)
        return self.event_matches[event_name]

    def instance_of(self, entry: ListenerEntry) -> object:
        return self.instances[entry.name]

    def close(self) -> None:
        ListenerSet.built_sets.discard(self.key)
