from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.claim_process.claim_process import ClaimProcess
from core.modules.processes.models.process import Process


class ClaimProcessSubcommand(Subcommand[ClaimProcess, Process]):
    """`journal process claim <process> --token <token>`: the runner claims its prepared run before the shell starts."""

    cli_name = "process"
    name = "claim"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--token", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> ClaimProcess:
        return ClaimProcess(arguments.process_id, arguments.token)
