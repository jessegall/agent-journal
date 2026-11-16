from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_title_requests import OutputTitleRequests
from core.modules.processes.models.lifecycles.process_lifecycle import OPEN


class OutputTitleRequestCloseListener(SaveListener[Changed[Process] | Changed[Output]]):
    """A run's request for a title closes in the write that ends the run or gives its output a descriptive title."""

    name = "processes.output-title-request-close"

    def __init__(self, requests: OutputTitleRequests, repository: Repository) -> None:
        self.requests, self.repository = requests, repository

    def handle(self, event: Changed[Process] | Changed[Output], context: Context) -> None:
        row = event.row
        if isinstance(row, Process) and row.state in OPEN:
            return
        if isinstance(row, Output) and not row.title.strip():
            return
        request = self.requests.open_for_process(row.id if isinstance(row, Process) else row.process_id)
        if request is not None:
            self.repository.update(request, context, closed_at=context.timestamp)
