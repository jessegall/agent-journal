from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.dependency_commands import TaskDependencyMake, TaskUndepend
from core.modules.tasks.task_dependency import TaskDependency


def dependency_arguments(parser: ArgumentParser) -> None:
    parser.add_argument("task_id", type=int)
    parser.add_argument("--on", type=int, required=True, dest="dependency_id")


class TaskDependSubcommand(Subcommand[TaskDependencyMake, TaskDependency]):
    """`journal task depend <task> --on <other task>`: the task waits on the other."""

    cli_name = "task"
    name = "depend"

    def arguments(self, parser: ArgumentParser) -> None:
        dependency_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> TaskDependencyMake:
        return TaskDependencyMake(arguments.task_id, arguments.dependency_id)


class TaskUndependSubcommand(Subcommand[TaskUndepend, None]):
    """`journal task undepend <task> --on <other task>`: the task no longer waits on the other."""

    cli_name = "task"
    name = "undepend"

    def arguments(self, parser: ArgumentParser) -> None:
        dependency_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> TaskUndepend:
        return TaskUndepend(arguments.task_id, arguments.dependency_id)

    def write_output(self, value: object, output: Output) -> None:
        output.line("the dependency is removed")
