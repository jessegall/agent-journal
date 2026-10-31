from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.remove_task_dependency import RemoveTaskDependency
from core.modules.tasks.dependency_subcommands import dependency_arguments


class RemoveTaskDependencySubcommand(Subcommand[RemoveTaskDependency, None]):
    """`journal task remove-dependency <task> --on <other task>`: the task no longer waits on the other."""

    cli_name = "task"
    name = "remove-dependency"

    def arguments(self, parser: ArgumentParser) -> None:
        dependency_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveTaskDependency:
        return RemoveTaskDependency(arguments.task_id, arguments.dependency_id)

    def write_output(self, value: object, output: Output) -> None:
        output.line("the dependency is removed")
