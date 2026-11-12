from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_visibility import RunVisibility


class EndProcessHandler(Handler[EndProcess, Process]):
    """Ends a process and keeps its complete output until the process is removed. A merge the journal ran itself ends
    with moves of its own and its output is never read for a reader, so no listener of an agent's ended run hears it."""

    command = EndProcess

    def __init__(self, rows: EventRows, repository: Repository, outputs: OutputQuery, bus: Bus, visibility: RunVisibility) -> None:
        self.rows, self.repository, self.outputs, self.bus, self.visibility = rows, repository, outputs, bus, visibility

    def handle(self, command: EndProcess, context: Context) -> Process:
        process = self.rows.required(Process, command.row_id)
        exit_code = command.exit_code or self.failed_test_code(process)
        ended = self.ended(process, context, exit_code)
        ended = self.repository.save_change(process, ended, context)
        if process.is_journal_merge or self.outputs.process_output(process.id) is None:
            return ended
        output = self.bus.dispatch(ReadNewOutput(process.id, is_final=True), context)
        self.repository.update(output, context, byte_count=command.byte_count, line_count=command.line_count, ended_at=context.timestamp)
        return ended

    @staticmethod
    def ended(process: Process, context: Context, exit_code: int) -> Process:
        if process.is_journal_merge:
            return process.end_journal_merge(context.timestamp, exit_code)
        return process.finish(context.timestamp, context.actor, exit_code) if exit_code == 0 else process.fail(context.timestamp, context.actor, exit_code)

    def failed_test_code(self, process: Process) -> int:
        """The exit code of a test part that failed while its line still ended well."""
        parts = self.visibility.shown_parts(process)
        return next((part.exit_code for part in parts if part.category.is_long_running and part.exit_code), 0)

