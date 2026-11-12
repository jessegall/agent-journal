from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.processes.support.output_delivery import OutputDelivery
from core.modules.processes.commands.support.output_lines import OutputLines
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.look_asks import LookAsks
from core.modules.processes.commands.read_output.support.output_texts import OutputTexts
from core.modules.processes.commands.read_output.support.repeat_reads import RepeatReads


class ReadOutputHandler(Handler[ReadOutput, OutputLines]):
    """Reads an output in the way asked and notes when it was first read; a later read writes nothing. An agent's
    read of a run still going answers the asks to look at it."""

    command = ReadOutput

    def __init__(self, texts: OutputTexts, outputs: OutputQuery, repository: Repository, repeats: RepeatReads, delivery: OutputDelivery, looks: LookAsks) -> None:
        self.texts, self.outputs, self.repository, self.repeats, self.delivery, self.looks = texts, outputs, repository, repeats, delivery, looks

    def handle(self, command: ReadOutput, context: Context) -> OutputLines:
        self.repeats.check(command, context)
        lines = self.texts.lines(context.actor, command)
        self.repeats.note(command, context.actor, context.timestamp.text)
        if context.actor.type is ActorType.AGENT and not self.repeats.has_ended(command.process_id):
            self.looks.record_answer(command.process_id, context.timestamp.value.timestamp())
        kept = self.outputs.process_output(command.process_id)
        if kept is not None and kept.state is OutputState.KEPT:
            self.mark_read(kept, command, lines, context)
        return OutputLines(lines)

    def mark_read(self, kept: Output, command: ReadOutput, lines: list[str], context: Context) -> None:
        read_at = context.timestamp if kept.read_at is None else kept.read_at
        if not self.is_full_read(command, kept):
            self.repository.update(kept, context, read_at=read_at)
            return
        pending = self.delivery.pending("\n".join(lines), {"lines": lines}, command.reader_process_id, command.json_output, context)
        self.repository.update(kept, context, read_at=read_at, fully_read_at=context.timestamp if pending is None else None, full_read_output_id=pending)

    def is_full_read(self, command: ReadOutput, output: Output) -> bool:
        return command.all and output.ended_at is not None and self.texts.is_complete(command.process_id)
