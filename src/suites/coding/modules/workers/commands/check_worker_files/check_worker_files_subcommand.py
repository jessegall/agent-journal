from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.check_worker_files.check_worker_files import CheckWorkerFiles


class CheckWorkerFilesSubcommand(Subcommand[CheckWorkerFiles, str]):
    """`journal merger scope <worker>`: a worker's own files beside the files its last refusal named."""

    cli_name = "merger"
    name = "scope"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> CheckWorkerFiles:
        return CheckWorkerFiles(arguments.worker_id)
