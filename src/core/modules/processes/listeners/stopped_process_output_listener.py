from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery

STOPPING_MOVES = ("stop", "orphan")


class StoppedProcessOutputListener(SaveListener):
    """A run that is stopped or orphaned has no end report, so its output is marked ended here, which lets it
    be pruned."""

    name = "processes.stopped-process-output"
    event = "process.*"

    def __init__(self, outputs: OutputQuery, repository: Repository) -> None:
        self.outputs, self.repository = outputs, repository

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if not isinstance(process, Process) or change.move is None or change.move.name not in STOPPING_MOVES:
            return
        for output in tuple(self.outputs.process(process.id).all_rows()):
            if output.ended_at is None:
                self.repository.save(replace(output, ended_at=change.context.timestamp), change.context)
