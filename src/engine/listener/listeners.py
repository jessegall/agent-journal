from engine.change.change import Change
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.listener.deletion_listener import is_deletion_listener_class
from engine.listener.save_listener import is_save_listener_class
from engine.model.model import Model
from engine.registry.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from engine.listener.listener_class_error import ListenerClassError
from collections.abc import Sequence


class Listeners:
    """Runs the listeners registered for a change's event inside its transaction: deletion listeners before a
    row is deleted, save listeners after a change is saved."""

    def __init__(self, registry: Registry, container: Container, change_filter: ChangeFilter, scopes: Scopes) -> None:
        self.registry, self.container, self.change_filter, self.scopes = registry, container, change_filter, scopes

    def run_deletion_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not is_deletion_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            if self.change_filter.applies(entry.name, change):
                self.container.get(listener_class).handle(change.typed_event(listener_class), change.context)

    def run_deletion_listeners_many(self, changes: Sequence[Change[Model]]) -> None:
        if not changes:
            return
        for entry in self.registry.event_listeners(changes[0].event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not is_deletion_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            events = [change.typed_event(listener_class) for change in changes if self.change_filter.applies(entry.name, change)]
            if events:
                self.container.get(listener_class).handle_many(events, changes[0].context)

    def run_save_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.SAVE):
            listener_class = entry.path.loaded()
            if not is_save_listener_class(listener_class):
                raise ListenerClassError(f"{entry.path.text} is no save listener")
            if self.change_filter.applies(entry.name, change):
                with self.scopes.change_scope(listener_class.disabled_scopes, change):
                    self.container.get(listener_class).handle(change.typed_event(listener_class), change.context)
