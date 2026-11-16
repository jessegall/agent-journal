from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_title_requests import OutputTitleRequests


class OutputTitleRequestCloseListener(SaveListener[Changed[Process]]):
    """A run's request for a title closes in the write that ends the run."""

    name = "processes.output-title-request-close"

    def __init__(self, requests: OutputTitleRequests) -> None:
        self.requests = requests

    def handle(self, event: Changed[Process], context: Context) -> None:
        if event.row.is_background_run_ended(event.old_row):
            self.requests.close(event.row.id, context)
