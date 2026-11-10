from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery


class ProcessOutputListener(SaveListener[Changed[Output]]):
    name = "processes.process-output"

    def __init__(self, outputs: OutputQuery) -> None:
        self.outputs = outputs

    def handle(self, event: Changed[Output], context: Context) -> None:
        if isinstance(event, Deleted):
            self.outputs.remove(event.row)
            return
        self.outputs.remember(event.row)
