from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.send_reading_notices.send_reading_notices import SendReadingNotices
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.reading_notices.reading_notices import ReadingNotices
from core.modules.processes.support.unreadable.unreadable_marker import UnreadableMarker
from core.modules.processes.support.run_visibility import RunVisibility

SOURCE = "processes.reading-notices"


class SendReadingNoticesHandler(Handler[SendReadingNotices, None]):
    """The one sender of the lines that tell an agent how to read its runs better, after the marks of unreadable
    commands are made or lifted at the run's end; the lines wait for the agent's next hook and never wake it."""

    command = SendReadingNotices

    def __init__(self, rows: EventRows, outputs: OutputQuery, visibility: RunVisibility, notices: ReadingNotices, nudger: Nudger, marker: UnreadableMarker) -> None:
        self.rows, self.outputs, self.visibility, self.notices, self.nudger, self.marker = rows, outputs, visibility, notices, nudger, marker

    def handle(self, command: SendReadingNotices, context: Context) -> None:
        process = self.rows.required(Process, command.process_id)
        parts = self.visibility.parts(process.id)
        changes = self.marker.changes(process, parts, context)
        for nudge in (*self.notices.mark_nudges(process, changes), *self.notices.nudges(process, self.outputs.process_output(process.id), parts)):
            self.nudger.send_nudge(process.session_agent_id, nudge, SOURCE, context)
