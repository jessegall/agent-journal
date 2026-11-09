from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.choose_next_task.choose_next_task import ChooseNextTask
from core.modules.tasks.models.task import Task


class ChooseNextTaskSubcommand(Subcommand[ChooseNextTask, Task]):
    """`journal task next <task>`: the task the agent is given next; a main agent may name another agent."""

    cli_name = "task"
    name = "next"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--agent", dest="agent_id", type=int, default=None, help="the agent that takes it next; only a main agent gives another agent")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseNextTask:
        return ChooseNextTask(arguments.task_id, arguments.agent_id)
