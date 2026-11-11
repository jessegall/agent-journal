from engine.event.event_subscriber import EventSubscriber
from engine.event.change import Change
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.listener.deletion_listener import is_deletion_listener_class
from engine.listener.save_listener import is_save_listener_class
from engine.model.model import Model
from engine.enums.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from engine.listener.errors.listener_class_error import ListenerClassError
from collections.abc import Sequence
from time import perf_counter

from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter

SLOW_HELD_LISTENER_SECONDS = 0.5


class Listeners:
    """Runs the listeners registered for a change's event inside its transaction: deletion listeners before a
    row is deleted, save listeners after a change is saved. A save listener that holds the transaction for half a
    second or more is written to the system log by name, since every other writer waits on it."""

    def __init__(self, registry: Registry, container: Container, change_filter: ChangeFilter, scopes: Scopes, system_log: SystemLogWriter) -> None:
        self.registry, self.container, self.change_filter, self.scopes, self.system_log = registry, container, change_filter, scopes, system_log

    def is_listener_due(self, name: str, listener_class: type[EventSubscriber[object]], change: Change[Model]) -> bool:
        return self.change_filter.applies(name, change) and change.reaches(listener_class)

    def run_deletion_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not is_deletion_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            if self.is_listener_due(entry.name, listener_class, change):
                self.container.get(listener_class).handle(change.typed_event(listener_class), change.context)

    def run_deletion_listeners_many(self, changes: Sequence[Change[Model]]) -> None:
        if not changes:
            return
        for entry in self.registry.event_listeners(changes[0].event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not is_deletion_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            events = [change.typed_event(listener_class) for change in changes if self.is_listener_due(entry.name, listener_class, change)]
            if events:
                self.container.get(listener_class).handle_many(events, changes[0].context)

    def run_save_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.SAVE):
            listener_class = entry.path.loaded()
            if not is_save_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no save listener")
            if not self.is_listener_due(entry.name, listener_class, change):
                continue
            started_at = perf_counter()
            with self.scopes.change_scope(listener_class.disabled_scopes, change):
                self.container.get(listener_class).handle(change.typed_event(listener_class), change.context)
            elapsed = perf_counter() - started_at
            if elapsed >= SLOW_HELD_LISTENER_SECONDS:
                self.system_log.write(LogLevel.INFORMATION, f"save listener {entry.name} held the write lock {elapsed * 1000:.0f} ms on {change.event}")
