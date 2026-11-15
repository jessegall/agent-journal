from engine.event.change import Change
from engine.container.container import Container
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

SLOW_SAVE_LISTENER_SECONDS = 0.5


class Listeners:
    """Runs the listeners registered for a change's event inside its transaction: deletion listeners before a
    row is deleted, save listeners after a change is saved. A save listener that runs half a second or more
    inside the transaction is written to the system log by name, since every other writer waits on it."""

    def __init__(self, registry: Registry, container: Container, scopes: Scopes, system_log: SystemLogWriter) -> None:
        self.registry, self.container, self.scopes, self.system_log = registry, container, scopes, system_log

    def run_deletion_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not is_deletion_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            if change.reaches(listener_class):
                self.container.get(listener_class).handle(change.typed_event(listener_class), change.context)

    def run_deletion_listeners_many(self, changes: Sequence[Change[Model]]) -> None:
        if not changes:
            return
        for entry in self.registry.event_listeners(changes[0].event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not is_deletion_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            events = [change.typed_event(listener_class) for change in changes if change.reaches(listener_class)]
            if events:
                self.container.get(listener_class).handle_many(events, changes[0].context)

    def run_save_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.SAVE):
            listener_class = entry.path.loaded()
            if not is_save_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no save listener")
            if not change.reaches(listener_class):
                continue
            started_at = perf_counter()
            with self.scopes.change_scope(listener_class.disabled_scopes, change):
                self.container.get(listener_class).handle(change.typed_event(listener_class), change.context)
            elapsed = perf_counter() - started_at
            if elapsed >= SLOW_SAVE_LISTENER_SECONDS:
                self.system_log.write(LogLevel.INFORMATION, f"save listener {entry.name} ran {elapsed * 1000:.0f} ms inside the write lock on {change.event}")
