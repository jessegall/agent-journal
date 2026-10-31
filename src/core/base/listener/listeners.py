from core.base.change.change import Change
from core.base.container import Container
from core.base.guard.change_filter import ChangeFilter
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry


class ListenerClassError(Exception):
    """Raised when a registered listener's path leads to a class that is no listener."""


class Listeners:
    """Runs the listeners registered for a change's event inside its transaction: deletion listeners before a
    row is deleted, save listeners after a change is saved."""

    def __init__(self, registry: Registry, container: Container, change_filter: ChangeFilter) -> None:
        self.registry, self.container, self.change_filter = registry, container, change_filter

    def run_deletion_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.DELETION):
            listener_class = entry.path.loaded()
            if not issubclass(listener_class, DeletionListener):
                raise ListenerClassError(f"{entry.path.text} is no deletion listener")
            if self.change_filter.applies(entry.name, change):
                self.container.get(listener_class).handle(change)

    def run_save_listeners(self, change: Change[Model]) -> None:
        for entry in self.registry.event_listeners(change.event, ListenerTiming.SAVE):
            listener_class = entry.path.loaded()
            if not issubclass(listener_class, SaveListener):
                raise ListenerClassError(f"{entry.path.text} is no save listener")
            if self.change_filter.applies(entry.name, change):
                self.container.get(listener_class).handle(change)
