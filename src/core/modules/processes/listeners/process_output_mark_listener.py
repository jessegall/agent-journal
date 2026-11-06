from core.base.change.logged_event import LoggedEvent
from core.base.change.touched import Touched
from core.modules.processes.listeners.process_mark_listener import ProcessMarkListener
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process


class ProcessOutputMarkListener(ProcessMarkListener[Touched[Output]]):
    """Each new reading of a run's output brings its chat mark up to date: the step count and the last lines live on the output row."""

    name = "processes.output-mark"

    def handle(self, event: Touched[Output], logged: LoggedEvent) -> None:
        output = self.rows.find(Output, logged.row_id)
        process = self.rows.find(Process, output.process_id) if output is not None else None
        if process is not None:
            self.show(process, logged)
