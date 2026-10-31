from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.commands.read_output import ReadOutput
from core.modules.processes.support.output_reading import OutputReading


class PeekOutputSubcommand(ReadSubcommand[OutputLines]):
    """`journal output peek <n> --summary|--all|--lines A-B|--tail K|--reader <name>`: shows what a run printed as `output read` does, without noting it as read; the windows read it."""

    cli_name = "output"
    name = "peek"

    def __init__(self, reading: OutputReading) -> None:
        self.reading = reading

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--summary", action="store_true")
        parser.add_argument("--all", action="store_true")
        parser.add_argument("--lines", default="")
        parser.add_argument("--tail", type=int)
        parser.add_argument("--reader", default="")

    def read(self, arguments: Namespace, caller: Caller) -> OutputLines:
        return OutputLines(self.reading.lines(caller.actor, ReadOutput(arguments.process_id, arguments.summary, arguments.all, arguments.lines, arguments.tail, arguments.reader)))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputLines):
            output.write("\n".join(value.lines), {"lines": list(value.lines)})
