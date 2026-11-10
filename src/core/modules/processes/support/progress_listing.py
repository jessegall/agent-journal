from engine.enums.command_category import CommandCategory
from engine.listener.event_rows import EventRows
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.count_command import CountCommand
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.progress_listing_command import ProgressListingCommand


class ProgressListing:
    """Builds the selected reader's listing for a running test."""

    def __init__(self, outputs: OutputQuery, rows: EventRows, visibility: RunVisibility) -> None:
        self.outputs, self.rows, self.visibility = outputs, rows, visibility

    def listing(self, process: Process) -> ProgressListingCommand | None:
        output = self.outputs.process_output(process.id)
        if output is None or output.reader_id is None:
            return None
        reader = self.rows.required(Reader, output.reader_id)
        if not reader.count_command or not reader.count_pattern or not reader.step_pattern:
            return None
        parts = self.visibility.parts(process.id)
        for part in parts:
            if part.category is not CommandCategory.TEST_RUN or output.reader_position not in (0, part.position):
                continue
            return ProgressListingCommand(CountCommand.filled(reader.count_command, part.command or part.text), part.position, reader.count_pattern)
        return None
