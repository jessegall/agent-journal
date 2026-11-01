from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output as CommandOutput
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_card import ProcessCard


class ProcessCardSubcommand(ReadSubcommand[ProcessCard]):
    """`journal process card <n>`: what a run's card draws, in one answer."""

    cli_name = "process"
    name = "card"

    def __init__(self, processes: ProcessQuery, outputs: OutputQuery) -> None:
        self.processes, self.outputs = processes, outputs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessCard:
        kept = self.outputs.process(arguments.process_id).page(1, 1).rows
        return ProcessCard(self.processes.find(arguments.process_id), kept[0] if kept else None)

    def write_output(self, value: object, output: CommandOutput) -> None:
        if isinstance(value, ProcessCard):
            output.write(value.output.title if value.output and value.output.title else value.process.line, value.json())
