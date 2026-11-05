from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.cli.make_subcommand import MakeSubcommand
from core.base.command.command import Command
from core.base.model.tables import Tables
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.commands.make_planned_task.make_planned_task import MakePlannedTask
from core.modules.tasks.models.task import Task


class MakeTaskSubcommand(Subcommand[Command[Task], Task]):
    """Makes a task, optionally placing it in a phase in the same command."""

    cli_name = "task"
    name = "make"

    def __init__(self, tables: Tables) -> None:
        self.make = MakeSubcommand(tables.table(Task))

    def arguments(self, parser: ArgumentParser) -> None:
        self.make.arguments(parser)
        parser.add_argument("--phase", type=int, dest="phase_id")

    def command(self, arguments: Namespace, caller: Caller) -> Command[Task]:
        task = self.make.command(arguments, caller)
        if arguments.phase_id is None:
            return task
        return MakePlannedTask(task, arguments.phase_id)
