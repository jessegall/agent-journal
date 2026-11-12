from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.event.logged_event import LoggedEvent
from core.modules.processes.listeners.process_mark_listener import MODULE_NAME, ProcessMarkListener
from core.modules.processes.models.process import Process

__all__ = ["MODULE_NAME", "ProcessEndMarkListener"]


class ProcessEndMarkListener(ProcessMarkListener[Changed[Process]]):
    """Each change of a run brings its chat mark up to date; a request row of a hook, a journal command or a run of
    the journal's own has no mark."""

    name = "processes.process-mark"

    def handle(self, event: Changed[Process], logged: LoggedEvent) -> None:
        if not isinstance(event, Deleted) and not event.row.is_request_row:
            self.show(event.row, logged)
