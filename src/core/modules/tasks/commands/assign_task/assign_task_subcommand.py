from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.task import Task


class AssignTaskSubcommand(Subcommand[AssignTask, Task]):
    """`journal task assign <task> --to <agent>`: gives a task to the agent named, as journal assign task does. Only
    a person or the main agent assigns."""

    cli_name = "task"
    name = "assign"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--to", dest="actor_id", type=AgentNumber, required=True)

    def command(self, arguments: Namespace, caller: Caller) -> AssignTask:
        return AssignTask(arguments.task_id, arguments.actor_id)
