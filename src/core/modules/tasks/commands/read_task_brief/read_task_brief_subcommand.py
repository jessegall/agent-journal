from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.overview_command import OverviewCommand
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.commands.read_task_brief.read_task_brief import ReadTaskBrief
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_brief import TaskBrief
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement


class ReadTaskBriefSubcommand(OverviewCommand, Subcommand[ReadTaskBrief, TaskBrief]):
    """`journal task overview <n>`: a task's title, brief, last comments and last log lines; an agent given a
    task is blocked until it ran this in its context window, and may read it again while it is."""

    cli_name = "task"
    name = "overview"

    def __init__(self, tasks: CurrentTasks, requirement: TaskBriefRequirement) -> None:
        self.tasks, self.requirement = tasks, requirement

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ReadTaskBrief:
        return ReadTaskBrief(arguments.task_id)

    def overview_target(self, arguments: Namespace) -> str:
        return str(arguments.task_id)

    def is_read_required(self, arguments: Namespace, caller: Caller) -> bool:
        current = self.tasks.started_tasks(caller.actor.id)
        return self.requirement.is_required and bool(current) and current[0].id == arguments.task_id and not self.tasks.has_brief_read(arguments.task_id, caller.actor.id)
