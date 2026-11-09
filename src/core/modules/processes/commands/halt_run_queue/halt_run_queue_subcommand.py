from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.errors.refusal import Refusal
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.halt_run_queue.halt_run_queue import HaltRunQueue


class HaltRunQueueSubcommand(Subcommand[HaltRunQueue, str]):
    """`journal queue halt "<why>"`: work still joins the queue of test runs, but none starts until `journal queue
    resume`; runs that already hold a spot go on."""

    cli_name = "queue"
    name = "halt"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("reason", nargs="?", default="")
        parser.add_argument("--reason", dest="reason_flag", default="", help="the reason, written as a flag so a button can fill it")

    def command(self, arguments: Namespace, caller: Caller) -> HaltRunQueue:
        reason = arguments.reason or arguments.reason_flag
        if not reason:
            raise Refusal("a halt needs a reason", "say why with the reason or --reason")
        return HaltRunQueue(reason)
