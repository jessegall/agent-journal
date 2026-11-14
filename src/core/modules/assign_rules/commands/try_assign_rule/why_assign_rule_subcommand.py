from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.trial.task_explanation import TaskExplanation
from core.modules.tasks.models.task import Task


class WhyAssignRuleSubcommand(ReadSubcommand[TaskExplanation]):
    """`journal assign-rule why <task>`: the rules' last decision about a task and what they would do with it now;
    it assigns nothing and records nothing."""

    cli_name = "assign-rule"
    name = "why"

    def __init__(self, queries: Queries, rules: AssignRules) -> None:
        self.queries, self.rules = queries, rules

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TaskExplanation:
        task = self.queries.query(Task).find(arguments.task_id)
        stored = self.rules.stored_decision(task)
        return TaskExplanation(task.id, stored, self.rules.preview(task, stored))
