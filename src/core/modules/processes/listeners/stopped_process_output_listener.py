from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from engine.change.moved import Moved
from dataclasses import replace

from engine.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from engine.command.context import Context



class StoppedProcessOutputListener(SaveListener[Moved[Process]]):
    """A run that is stopped or orphaned has no end report, so its output is marked ended here, which lets it
    be pruned."""

    name = "processes.stopped-process-output"
    moves = (ProcessLifecycle.stop, ProcessLifecycle.orphan)

    def __init__(self, outputs: OutputQuery, repository: Repository) -> None:
        self.outputs, self.repository = outputs, repository

    def handle(self, event: Moved[Process], context: Context) -> None:
        process = event.row
        for output in tuple(self.outputs.process(process.id).all_rows()):
            if output.ended_at is None:
                self.repository.save(replace(output, ended_at=context.timestamp), context)
