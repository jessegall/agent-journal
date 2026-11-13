from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.store_end_decisions.store_end_decisions import StoreEndDecisions
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.support.reading.shadow_decisions import ShadowDecisions
from core.modules.processes.support.run_visibility import RunVisibility


class StoreEndDecisionsHandler(Handler[StoreEndDecisions, None]):
    """Keeps the reading decision of an ended run of an agent; a merge the journal ran itself has no reader to judge."""

    command = StoreEndDecisions

    def __init__(self, rows: EventRows, visibility: RunVisibility, trial: ShadowDecisions) -> None:
        self.rows, self.visibility, self.shadow = rows, visibility, trial

    def handle(self, command: StoreEndDecisions, context: Context) -> None:
        process = self.rows.required(Process, command.process_id)
        self.shadow.store(process, self.visibility.shown_parts(process), ReadingMoment.END, context)
