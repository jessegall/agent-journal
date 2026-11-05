from dataclasses import replace

from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.processes.models.output import Output
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_judge import ReaderJudge
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class ReaderProofListener(SaveListener[Changed[Output]]):
    """Records the output a reader passed on when a run's final output is saved."""

    name = "processes.reader-proof"

    def __init__(self, readers: ReaderQuery, parts: ProcessPartQuery, judge: ReaderJudge, repository: Repository) -> None:
        self.readers, self.parts, self.judge, self.repository = readers, parts, judge, repository

    def handle(self, event: Changed[Output], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        output = event.row
        if not isinstance(output, Output) or output.ended_at is None or output.reader_id is None or not output.line_count:
            return
        reader = self.readers.find(output.reader_id)
        if reader.proved_on is not None:
            return
        parts = self.parts.process(output.process_id).filter(position=output.reader_position).page(1, 1).rows
        if not parts:
            return
        if self.judge.misses_read_output(reader, parts[0].category, output):
            return
        self.repository.save(replace(reader, proved_on=output.process_id), context)
