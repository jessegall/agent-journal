from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.support.reading.shadow_decisions import ShadowDecisions


class EndProcessHandler(Handler[EndProcess, Process]):
    """Ends a process and keeps its complete output until the process is removed."""

    command = EndProcess

    def __init__(self, rows: EventRows, repository: Repository, outputs: OutputQuery, bus: Bus, visibility: RunVisibility, shadow: ShadowDecisions) -> None:
        self.rows, self.repository, self.outputs, self.bus, self.visibility = rows, repository, outputs, bus, visibility
        self.shadow = shadow

    def handle(self, command: EndProcess, context: Context) -> Process:
        process = self.rows.required(Process, command.row_id)
        exit_code = command.exit_code or self.failed_test_code(process)
        ended = process.finish(context.timestamp, context.actor, exit_code) if exit_code == 0 else process.fail(context.timestamp, context.actor, exit_code)
        ended = self.repository.save_change(process, ended, context)
        if self.outputs.process_output(process.id) is not None:
            self.final_output(process, command, context)
        self.shadow.store(ended, self.visibility.parts(process.id), ReadingMoment.END, context)
        return ended

    def final_output(self, process: Process, command: EndProcess, context: Context) -> None:
        output = self.bus.dispatch(ReadNewOutput(process.id, is_final=True), context)
        self.repository.update(output, context, byte_count=command.byte_count, line_count=command.line_count, ended_at=context.timestamp)

    def failed_test_code(self, process: Process) -> int:
        parts = self.visibility.parts(process.id)
        return next((part.exit_code for part in parts if part.category.is_long_running and part.exit_code), 0)

