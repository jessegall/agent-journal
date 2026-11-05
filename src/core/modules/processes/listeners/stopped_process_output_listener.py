from dataclasses import replace

from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.base.change.changed import Changed
from core.base.command.context import Context

STOPPING_MOVES = ("stop", "orphan")


class StoppedProcessOutputListener(SaveListener[Changed[Process]]):
    """A run that is stopped or orphaned has no end report, so its output is marked ended here, which lets it
    be pruned."""

    name = "processes.stopped-process-output"

    def __init__(self, outputs: OutputQuery, repository: Repository) -> None:
        self.outputs, self.repository = outputs, repository

    def handle(self, event: Changed[Process], context: Context) -> None:
        process = event.row
        if not isinstance(process, Process) or event.move is None or event.move.name not in STOPPING_MOVES:
            return
        for output in tuple(self.outputs.process(process.id).all_rows()):
            if output.ended_at is None:
                self.repository.save(replace(output, ended_at=context.timestamp), context)
