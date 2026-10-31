from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.deliver_task import DeliverTask


class DeliverTaskSubcommand(Subcommand[DeliverTask, Task]):
    """`journal worker deliver`: the worker's task is done, with a proof for every point of its brief."""

    cli_name = "worker"
    name = "deliver"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> DeliverTask:
        return DeliverTask()
