from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.commands.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_reading import OutputReading


class ReadOutputHandler(Handler[ReadOutput, OutputLines]):
    """Reads an output in the way asked and notes when it was read."""

    command = ReadOutput

    def __init__(self, reading: OutputReading, outputs: OutputQuery, repository: Repository) -> None:
        self.reading, self.outputs, self.repository = reading, outputs, repository

    def handle(self, command: ReadOutput, context: Context) -> OutputLines:
        lines = self.reading.lines(context.actor, command)
        kept = self.outputs.process(command.process_id).filter(state=OutputState.KEPT).page(1, 1).rows
        if kept:
            self.repository.save(replace(kept[0], read_at=context.timestamp), context)
        return OutputLines(lines)
