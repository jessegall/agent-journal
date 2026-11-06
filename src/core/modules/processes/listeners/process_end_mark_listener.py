from core.base.change.logged_event import LoggedEvent
from core.base.change.touched import Touched
from core.modules.processes.listeners.process_mark_listener import MODULE_NAME, ProcessMarkListener
from core.modules.processes.models.process import Process

__all__ = ["MODULE_NAME", "ProcessEndMarkListener"]


class ProcessEndMarkListener(ProcessMarkListener[Touched[Process]]):
    """Each change of a run brings its chat mark up to date."""

    name = "processes.process-mark"

    def handle(self, event: Touched[Process], logged: LoggedEvent) -> None:
        process = self.rows.find(Process, logged.row_id)
        if process is not None:
            self.show(process, logged)
