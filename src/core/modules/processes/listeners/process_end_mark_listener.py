from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.change.logged_event import LoggedEvent
from core.modules.processes.listeners.process_mark_listener import MODULE_NAME, ProcessMarkListener
from core.modules.processes.models.process import Process

__all__ = ["MODULE_NAME", "ProcessEndMarkListener"]


class ProcessEndMarkListener(ProcessMarkListener[Changed[Process]]):
    """Each change of a run brings its chat mark up to date."""

    name = "processes.process-mark"

    def handle(self, event: Changed[Process], logged: LoggedEvent) -> None:
        if not isinstance(event, Deleted):
            self.show(event.row, logged)
