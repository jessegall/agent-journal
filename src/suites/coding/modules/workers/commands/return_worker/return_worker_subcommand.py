from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.return_worker.return_worker import ReturnWorker
from suites.coding.modules.workers.commands.merger.worker_text_arguments import worker_text_arguments


class ReturnWorkerSubcommand(Subcommand[ReturnWorker, None]):
    """`journal merger pass <worker> "<why>"`: leaves the worker to the main agent."""

    cli_name = "merger"
    name = "pass"

    def arguments(self, parser: ArgumentParser) -> None:
        worker_text_arguments(parser, "reason")

    def command(self, arguments: Namespace, caller: Caller) -> ReturnWorker:
        return ReturnWorker(arguments.worker_id, arguments.reason)
