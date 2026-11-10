from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.models.process_part import ProcessPart


class StartProcessPartSubcommand(Subcommand[StartProcessPart, ProcessPart]):
    """`journal process part-start <process> --position <number>`: the runner reports that one part began."""

    cli_name = "process"
    name = "part-start"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--position", type=int, required=True)

    def command(self, arguments: Namespace, caller: Caller) -> StartProcessPart:
        return StartProcessPart(arguments.process_id, arguments.position)
