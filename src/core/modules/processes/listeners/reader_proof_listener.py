from core.modules.processes.events.output_ended import OutputEnded
from engine.change.updated import Updated
from dataclasses import replace

from core.base.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from core.modules.processes.models.output import Output
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.base.listener.event_rows import EventRows
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_judge import ReaderJudge
from engine.command.context import Context


class ReaderProofListener(SaveListener[OutputEnded | Updated[Output]]):
    """Records the output a reader passed on when a run's final output is saved."""

    name = "processes.reader-proof"

    def __init__(self, rows: EventRows, parts: ProcessPartQuery, judge: ReaderJudge, repository: Repository) -> None:
        self.rows, self.parts, self.judge, self.repository = rows, parts, judge, repository

    def handle(self, event: OutputEnded | Updated[Output], context: Context) -> None:
        output = event.row
        if output.ended_at is None or output.reader_id is None or not output.line_count:
            return
        reader = self.rows.required(Reader, output.reader_id)
        if reader.proved_on is not None:
            return
        part = self.parts.process(output.process_id).filter(position=output.reader_position).first()
        if part is None:
            return
        if self.judge.misses_read_output(reader, part.category, output):
            return
        self.repository.save(replace(reader, proved_on=output.process_id), context)
