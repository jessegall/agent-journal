from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.output_query import OutputQuery


@dataclass(frozen=True)
class ProgressListingCommand:
    line: str
    position: int
    pattern: str


class ProgressListing:
    """Builds the selected reader's listing for a running test."""

    def __init__(self, outputs: OutputQuery, rows: EventRows, queries: Queries) -> None:
        self.outputs, self.rows, self.queries = outputs, rows, queries

    def for_process(self, process: Process) -> ProgressListingCommand | None:
        output = self.outputs.process_output(process.id)
        if output is None or output.reader_id is None:
            return None
        reader = self.rows.required(Reader, output.reader_id)
        if not reader.count_command or not reader.count_pattern or not reader.step_pattern:
            return None
        parts = self.queries.query(ProcessPart).filter(process_id=process.id).oldest().all_rows()
        for part in parts:
            if part.category is not CommandCategory.TEST_RUN or output.reader_position not in (0, part.position):
                continue
            return ProgressListingCommand(reader.count_command.replace("{part}", part.command or part.text), part.position, reader.count_pattern)
        return None
