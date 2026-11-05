from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart


class EndProcessHandler(Handler[EndProcess, Process]):
    """Ends a process and keeps its complete output until the process is removed."""

    command = EndProcess

    def __init__(self, queries: Queries, repository: Repository, outputs: OutputQuery, bus: Bus) -> None:
        self.queries, self.repository, self.outputs, self.bus = queries, repository, outputs, bus

    def handle(self, command: EndProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.row_id)
        exit_code = command.exit_code or self.failed_test_code(process)
        ended = process.finish(context.timestamp, context.actor, exit_code) if exit_code == 0 else process.fail(context.timestamp, context.actor, exit_code)
        ended = self.repository.save(ended, context)
        if not self.outputs.process(process.id).exists():
            return ended
        self.bus.dispatch(ReadNewOutput(process.id, is_final=True), context)
        output = self.outputs.process(process.id).limited(1)[0]
        self.repository.save(replace(output, byte_count=command.byte_count, line_count=command.line_count, ended_at=context.timestamp), context)
        return ended

    def failed_test_code(self, process: Process) -> int:
        parts = self.queries.query(ProcessPart).filter(process_id=process.id).all_rows()
        return next((part.exit_code for part in parts if part.category.is_long_running and part.exit_code), 0)

