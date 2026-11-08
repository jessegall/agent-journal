from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.driver.command_category import CommandCategory
from core.base.subcommand.output import Output as CommandOutput
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.process_card import ProcessCard
from core.modules.processes.support.run_title import RunTitle


class ProcessCardSubcommand(ReadSubcommand[ProcessCard]):
    """`journal process card <n>`: what a run's card draws, in one answer."""

    cli_name = "process"
    name = "card"

    def __init__(self, processes: ProcessQuery, outputs: OutputQuery, parts: ProcessPartQuery, readers: ReaderQuery) -> None:
        self.processes, self.outputs, self.parts, self.readers = processes, outputs, parts, readers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessCard:
        kept = self.outputs.process(arguments.process_id).first()
        parts = list(self.parts.process(arguments.process_id).all_rows())
        process = self.processes.find(arguments.process_id)
        visible = next((part for part in parts if part.category.is_watched), None)
        reader = self.readers.find(kept.reader_id) if kept is not None and kept.reader_id else None
        return ProcessCard(process, kept, RunTitle.temporary(visible), reader, visible.category if visible else CommandCategory.UNKNOWN, any(part.reader_request_id is not None for part in parts))

    def write_output(self, value: object, output: CommandOutput) -> None:
        if isinstance(value, ProcessCard):
            output.write(value.title, value.json())
