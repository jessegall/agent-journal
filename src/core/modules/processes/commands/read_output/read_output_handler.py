from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.processes.commands.support.output_lines import OutputLines
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.commands.read_output.support.output_texts import OutputTexts
from core.modules.processes.commands.read_output.support.repeat_reads import RepeatReads


class ReadOutputHandler(Handler[ReadOutput, OutputLines]):
    """Reads an output in the way asked and notes when it was first read; a later read writes nothing."""

    command = ReadOutput

    def __init__(self, texts: OutputTexts, outputs: OutputQuery, repository: Repository, repeats: RepeatReads) -> None:
        self.texts, self.outputs, self.repository, self.repeats = texts, outputs, repository, repeats

    def handle(self, command: ReadOutput, context: Context) -> OutputLines:
        self.repeats.check(command, context.actor)
        lines = self.texts.lines(context.actor, command)
        self.repeats.note(command, context.actor, context.timestamp.text)
        kept = self.outputs.process(command.process_id).filter(state=OutputState.KEPT).page(1, 1).rows
        if kept and kept[0].read_at is None:
            self.repository.save(replace(kept[0], read_at=context.timestamp), context)
        return OutputLines(lines)
