from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.task import Task


class AssignTaskSubcommand(Subcommand[AssignTask, Task]):
    """`journal task assign <task> --to <agent>`: moves a task to another worker or back to the main agent."""

    cli_name = "task"
    name = "assign"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--to", dest="agent_id", type=int, required=True)

    def command(self, arguments: Namespace, caller: Caller) -> AssignTask:
        return AssignTask(arguments.task_id, arguments.agent_id)
