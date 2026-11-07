from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.return_worker.return_worker import ReturnWorker


class ReturnWorkerSubcommand(Subcommand[ReturnWorker, None]):
    """`journal merger pass <worker> "<why>"`: leaves the worker to the main agent."""

    cli_name = "merger"
    name = "pass"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("reason")

    def command(self, arguments: Namespace, caller: Caller) -> ReturnWorker:
        return ReturnWorker(arguments.worker_id, arguments.reason)
