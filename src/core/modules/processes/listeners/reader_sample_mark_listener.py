from core.base.change.logged_event import LoggedEvent
from core.modules.processes.listeners.reader_request_mark_listener import ReaderRequestMarkListener
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.output_folder import OutputFolder


class ReaderSampleMarkListener(ReaderRequestMarkListener):
    """Updates a reader request's mark when its sample output changes."""

    name = "processes.reader-sample-mark"
    event = "output.*"

    def __init__(self, requests: ReaderRequestQuery, folder: OutputFolder, bus: Bus, actors: ModuleActors, outputs: OutputQuery) -> None:
        super().__init__(requests, folder, bus, actors)
        self.outputs = outputs

    def handle(self, event: LoggedEvent) -> None:
        outputs = self.outputs.filter(id=event.row_id).page(1, 1).rows
        if not outputs:
            return
        for request in self.requests.open().filter(sample_process_id=outputs[0].process_id).all_rows():
            self.show(request, event)
