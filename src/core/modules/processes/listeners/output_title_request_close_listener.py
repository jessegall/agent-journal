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
        if not self.closes_the_request(event):
            return
        request = self.requests.open_for_process(row.id if isinstance(row, Process) else row.process_id)
        if request is not None:
            self.repository.update(request, context, closed_at=context.timestamp)

    @staticmethod
    def closes_the_request(event: Changed[Process] | Changed[Output]) -> bool:
        row, old_row = event.row, event.old_row
        if isinstance(row, Process):
            return row.moved_at is not None and row.state not in OPEN and (old_row is None or old_row.state in OPEN)
        return bool(row.title.strip()) and (old_row is None or old_row.title != row.title)
