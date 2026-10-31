from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.make_task_dependency import MakeTaskDependency
from core.modules.tasks.task_dependency import TaskDependency
from core.modules.tasks.dependency_subcommands import dependency_arguments


class TaskDependSubcommand(Subcommand[MakeTaskDependency, TaskDependency]):
    """`journal task depend <task> --on <other task>`: the task waits on the other."""

    cli_name = "task"
    name = "depend"

    def arguments(self, parser: ArgumentParser) -> None:
        dependency_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> MakeTaskDependency:
        return MakeTaskDependency(arguments.task_id, arguments.dependency_id)
