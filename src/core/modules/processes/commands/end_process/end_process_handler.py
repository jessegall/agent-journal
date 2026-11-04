from core.modules.processes.models.enums.process_state import ProcessState
from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.process_settings import ProcessSettings


class EndProcessHandler(Handler[EndProcess, Process]):
    """Ends the process, passes the rest of its output through its reader, and keeps the output, except for a
    short run whose line pipes nothing. A line whose test run or build failed fails, whatever came after it."""

    command = EndProcess

    def __init__(self, queries: Queries, repository: Repository, settings: ProcessSettings, outputs: OutputQuery, bus: Bus) -> None:
        self.queries, self.repository, self.settings, self.outputs, self.bus = queries, repository, settings, outputs, bus

    def handle(self, command: EndProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.row_id)
        exit_code = command.exit_code or self.failed_test_code(process)
        ended = process.finish(context.timestamp, context.actor, exit_code) if exit_code == 0 else process.fail(context.timestamp, context.actor, exit_code)
        ended = self.repository.save(ended, context)
        if not self.outputs.process(process.id).exists():
            return ended
        self.bus.dispatch(ReadNewOutput(process.id, is_final=True), context)
        output = self.outputs.process(process.id).page(1, 1).rows[0]
        if process.state is not ProcessState.BACKGROUND and self.is_short(process, command):
            self.repository.delete(output, context)
        else:
            self.repository.save(replace(output, byte_count=command.byte_count, line_count=command.line_count, ended_at=context.timestamp), context)
        return ended

    def failed_test_code(self, process: Process) -> int:
        parts = self.queries.query(ProcessPart).filter(process_id=process.id).all_rows()
        return next((part.exit_code for part in parts if part.category.is_long_running and part.exit_code), 0)

    def is_short(self, process: Process, command: EndProcess) -> bool:
        is_piped = self.queries.query(ProcessPart).filter(process_id=process.id, piped=True).exists()
        return command.byte_count < self.settings.integer(ProcessSetting.SHORT_OUTPUT_BYTES, process.environment_id) and not is_piped
