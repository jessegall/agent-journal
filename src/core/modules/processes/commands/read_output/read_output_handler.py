
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.processes.support.output_delivery import OutputDelivery
from core.modules.processes.commands.support.output_lines import OutputLines
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.commands.read_output.support.output_texts import OutputTexts
from core.modules.processes.commands.read_output.support.repeat_reads import RepeatReads


class ReadOutputHandler(Handler[ReadOutput, OutputLines]):
    """Reads an output in the way asked and notes when it was first read; a later read writes nothing."""

    command = ReadOutput

    def __init__(self, texts: OutputTexts, outputs: OutputQuery, repository: Repository, repeats: RepeatReads, delivery: OutputDelivery) -> None:
        self.texts, self.outputs, self.repository, self.repeats, self.delivery = texts, outputs, repository, repeats, delivery

    def handle(self, command: ReadOutput, context: Context) -> OutputLines:
        self.repeats.check(command, context.actor)
        lines = self.texts.lines(context.actor, command)
        self.repeats.note(command, context.actor, context.timestamp.text)
        kept = self.outputs.process_output(command.process_id)
        if kept is not None and kept.state is OutputState.KEPT:
            values = {}
            if kept.read_at is None:
                values["read_at"] = context.timestamp
            if self.is_full_read(command, kept):
                pending = self.delivery.pending("\n".join(lines), {"lines": lines}, command.reader_process_id, command.json_output, context)
                values["fully_read_at"] = context.timestamp if pending is None else None
                values["full_read_output_id"] = pending
            if values:
                self.repository.update(kept, context, **values)
        return OutputLines(lines)

    def is_full_read(self, command: ReadOutput, output: Output) -> bool:
        return command.all and output.ended_at is not None and self.texts.is_complete(command.process_id)
