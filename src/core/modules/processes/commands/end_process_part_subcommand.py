from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.end_process_part import EndProcessPart
from core.modules.processes.models.process_part import ProcessPart


class EndProcessPartSubcommand(Subcommand[EndProcessPart, ProcessPart]):
    """`journal process part-end <process> --position <number> --exit-code <code>`: the runner reports how one part ended."""

    cli_name = "process"
    name = "part-end"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--position", type=int, required=True)
        parser.add_argument("--exit-code", type=int, required=True, dest="exit_code")

    def command(self, arguments: Namespace, caller: Caller) -> EndProcessPart:
        return EndProcessPart(arguments.process_id, arguments.position, arguments.exit_code)
