from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.cancel_queued_run.cancel_queued_run import CancelQueuedRun
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.queued_run_output import print_queued_run


class CancelQueuedRunSubcommand(Subcommand[CancelQueuedRun, QueuedRun]):
    """`journal plugin queue-cancel <run>`: stops a queued run that waits or runs."""

    cli_name = "plugin"
    name = "queue-cancel"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("run", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> CancelQueuedRun:
        return CancelQueuedRun(arguments.run)

    def write_output(self, value: object, output: Output) -> None:
        print_queued_run(value, output)
