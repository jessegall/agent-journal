from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.store_end_decisions.store_end_decisions import StoreEndDecisions
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.process import Process
from core.modules.processes.support.reading.recorded_decisions import RecordedDecisions


class StoreEndDecisionsHandler(Handler[StoreEndDecisions, None]):
    """Keeps the reading decisions of an ended run of an agent, which were decided before this write."""

    command = StoreEndDecisions

    def __init__(self, rows: EventRows, trial: RecordedDecisions) -> None:
        self.rows, self.shadow = rows, trial

    def handle(self, command: StoreEndDecisions, context: Context) -> None:
        self.shadow.keep(self.rows.required(Process, command.process_id), command.decided, ReadingPhase.END, context)
