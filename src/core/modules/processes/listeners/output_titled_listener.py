from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.processes.models.output import Output
from core.modules.processes.support.output_title_requests import OutputTitleRequests


class OutputTitledListener(SaveListener[Changed[Output]]):
    """A run's request for a title closes in the write that gives its output a title."""

    name = "processes.output-titled"

    def __init__(self, requests: OutputTitleRequests) -> None:
        self.requests = requests

    def handle(self, event: Changed[Output], context: Context) -> None:
        if event.row.is_newly_titled(event.old_row):
            self.requests.close(event.row.process_id, context)
