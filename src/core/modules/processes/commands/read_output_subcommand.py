from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.commands.output_lines_writing import OutputLinesWriting
from core.modules.processes.commands.read_output import ReadOutput


class ReadOutputSubcommand(OutputLinesWriting, Subcommand[ReadOutput, OutputLines]):
    """`journal output read <n> --summary|--all|--lines A-B|--tail K|--reader <name>`: reads what a run
    printed, by one of five ways."""

    cli_name = "output"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        OutputLines.add_flags(parser)

    def command(self, arguments: Namespace, caller: Caller) -> ReadOutput:
        return ReadOutput(arguments.process_id, arguments.summary, arguments.all, arguments.lines, arguments.tail, arguments.reader)
