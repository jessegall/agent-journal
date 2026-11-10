from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.change.logged_event import LoggedEvent
from core.modules.processes.listeners.process_mark_listener import ProcessMarkListener
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process


class ProcessOutputMarkListener(ProcessMarkListener[Changed[Output]]):
    """Each new reading of a run's output brings its chat mark up to date; the step count and last lines are on
    the output row."""

    name = "processes.output-mark"

    def handle(self, event: Changed[Output], logged: LoggedEvent) -> None:
        if isinstance(event, Deleted):
            return
        process = self.rows.find(Process, event.row.process_id)
        if process is not None:
            self.show(process, logged)
