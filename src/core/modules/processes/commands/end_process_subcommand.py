from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.end_process import EndProcess
from core.modules.processes.models.process import Process


class EndProcessSubcommand(Subcommand[EndProcess, Process]):
    """`journal process end <process> --exit-code <code> --bytes <count> --lines <count>`: the runner reports
    how the line ended."""

    cli_name = "process"
    name = "end"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        parser.add_argument("--exit-code", type=int, required=True, dest="exit_code")
        parser.add_argument("--bytes", type=int, required=True, dest="byte_count")
        parser.add_argument("--lines", type=int, required=True, dest="line_count")

    def command(self, arguments: Namespace, caller: Caller) -> EndProcess:
        return EndProcess(arguments.row_id, arguments.exit_code, arguments.byte_count, arguments.line_count)
