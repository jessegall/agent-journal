from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.make_subcommand import MakeSubcommand
from engine.cli.write_flags import WriteFlags
from core.base.command.command import Command
from core.base.model.tables import Tables
from core.base.subcommand.subcommand import Subcommand
from core.base.subcommand.output import Output
from core.modules.plans.commands.make_planned_task.make_planned_task import MakePlannedTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_metadata_reminder import TaskMetadataReminder


class MakeTaskSubcommand(Subcommand[Command[Task], Task]):
    """Makes a task, optionally placing it in a phase in the same command."""

    cli_name = "task"
    name = "make"

    def __init__(self, tables: Tables, flags: WriteFlags, reminder: TaskMetadataReminder) -> None:
        self.make = MakeSubcommand(tables.table(Task))
        self.flags = flags
        self.reminder = reminder

    def arguments(self, parser: ArgumentParser) -> None:
        self.make.arguments(parser)
        parser.add_argument("--phase", type=int, dest="phase_id")
        parser.add_argument("--tag", action="append", dest="tags", default=[])

    def command(self, arguments: Namespace, caller: Caller) -> Command[Task]:
        task = self.make.command(arguments, caller)
        if arguments.phase_id is None and not arguments.tags:
            return task
        return MakePlannedTask(task, arguments.phase_id, tuple(arguments.tags), self.flags.consume_short_flag(arguments, "confirm"))

    def write_output(self, value: object, output: Output) -> None:
        super().write_output(value, output)
        if output.json_output or not isinstance(value, Task):
            return
        text = self.reminder.text(value)
        if text:
            output.line(text)
