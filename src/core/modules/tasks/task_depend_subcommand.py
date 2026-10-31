from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.task_dependency_make import TaskDependencyMake
from core.modules.tasks.task_dependency import TaskDependency
from core.modules.tasks.dependency_subcommands import dependency_arguments


class TaskDependSubcommand(Subcommand[TaskDependencyMake, TaskDependency]):
    """`journal task depend <task> --on <other task>`: the task waits on the other."""

    cli_name = "task"
    name = "depend"

    def arguments(self, parser: ArgumentParser) -> None:
        dependency_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> TaskDependencyMake:
        return TaskDependencyMake(arguments.task_id, arguments.dependency_id)
