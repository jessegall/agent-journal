from engine.listener.save_listener import SaveListener
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.reading.reading_enforcer import ReadingEnforcer
from engine.event.created import Created
from engine.command.context import Context


class ReaderBlockListener(SaveListener[Created[ProcessPart]]):
    """Has the reading enforcer hold an agent whose new run part opened a reader request."""

    name = "processes.reader-block"

    def __init__(self, rows: EventRows, enforcer: ReadingEnforcer) -> None:
        self.rows, self.enforcer = rows, enforcer

    def handle(self, event: Created[ProcessPart], context: Context) -> None:
        part = event.row
        if part.reader_request_id is None:
            return
        self.enforcer.block_for_request(self.rows.required(Process, part.process_id), part, context)
