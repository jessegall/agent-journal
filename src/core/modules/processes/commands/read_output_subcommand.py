from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.output_lines import OutputLines
from core.modules.processes.commands.read_output import ReadOutput


class ReadOutputSubcommand(Subcommand[ReadOutput, OutputLines]):
    """`journal output read <n> --summary|--all|--lines A-B|--tail K|--reader <name>`: reads what a run printed, by one of five ways."""

    cli_name = "output"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--summary", action="store_true")
        parser.add_argument("--all", action="store_true")
        parser.add_argument("--lines", default="")
        parser.add_argument("--tail", type=int)
        parser.add_argument("--reader", default="")

    def command(self, arguments: Namespace, caller: Caller) -> ReadOutput:
        return ReadOutput(arguments.process_id, arguments.summary, arguments.all, arguments.lines, arguments.tail, arguments.reader)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, OutputLines):
            output.write("\n".join(value.lines), {"lines": list(value.lines)})
