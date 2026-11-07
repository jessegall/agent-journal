from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.halt_run_queue.halt_run_queue import HaltRunQueue


class HaltRunQueueSubcommand(Subcommand[HaltRunQueue, str]):
    """`journal queue halt "<why>"`: work still joins the queue of test runs, but none starts until `journal queue
    resume`; runs that already hold a spot go on."""

    cli_name = "queue"
    name = "halt"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reason")

    def command(self, arguments: Namespace, caller: Caller) -> HaltRunQueue:
        return HaltRunQueue(arguments.reason)
