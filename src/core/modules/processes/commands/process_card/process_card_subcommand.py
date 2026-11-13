from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.enums.command_category import CommandCategory
from engine.subcommand.output import Output as CommandOutput
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.reading_notices.reading_card_text import ReadingCardText
from core.modules.processes.support.process_card import ProcessCard
from core.modules.processes.support.run_title import RunTitle
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.reading.run_command_words import RunCommandWords
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks


class ProcessCardSubcommand(ReadSubcommand[ProcessCard]):
    """`journal process card <n>`: what a run's card draws, in one answer."""

    cli_name = "process"
    name = "card"

    def __init__(self, processes: ProcessQuery, outputs: OutputQuery, parts: ProcessPartQuery, readers: ReaderQuery, decisions: ReadingDecisionQuery,
                 marks: UnreadableMarks) -> None:
        self.processes, self.outputs, self.parts, self.readers = processes, outputs, parts, readers
        self.decisions, self.marks = decisions, marks

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessCard:
        kept = self.outputs.process(arguments.process_id).first()
        parts = self.parts.parts_of(arguments.process_id)
        process = self.processes.find(arguments.process_id)
        visible = RunVisibility.select_visible_part(process, tuple(parts)) or (parts[0] if parts else None)
        reader = self.readers.find(kept.reader_id) if kept is not None and kept.reader_id else None
        terms = RunCommandWords.of_parts(parts)
        return ProcessCard(process, kept, RunTitle.temporary(visible), reader, visible.category if visible else CommandCategory.UNKNOWN, any(part.reader_request_id is not None for part in parts),
                           self.reading_text(process.id, visible), terms, self.marked_words(terms))

    def marked_words(self, terms: str) -> str:
        mark = self.marks.marked(terms) if terms else None
        return mark.words if mark is not None else ""

    def reading_text(self, process_id: int, visible: ProcessPart | None) -> str | None:
        decision = self.decisions.end_for_part(process_id, visible.position) if visible is not None else None
        return None if decision is None else ReadingCardText.text(decision)

    def write_output(self, value: object, output: CommandOutput) -> None:
        if isinstance(value, ProcessCard):
            output.write(value.title, value.json())
