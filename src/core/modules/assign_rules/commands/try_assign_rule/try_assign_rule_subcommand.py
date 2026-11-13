from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.rule_arguments import CONDITION_HELP, RuleArguments
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.trial.rule_trial import RuleTrial
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.tasks.models.task import Task

UNSAVED_RULE_NAME = "the rule"


class TryAssignRuleSubcommand(ReadSubcommand[RuleTrial]):
    """`journal assign-rule try <task> --rule <rule>` or `--condition ...`: a dry run that prints whether a
    saved or unsaved rule would match the task and what each condition found; it assigns nothing and records
    nothing."""

    cli_name = "assign-rule"
    name = "try"

    def __init__(self, queries: Queries, conditions: RuleConditions, facts_reader: TaskFactsReader) -> None:
        self.queries, self.conditions, self.facts_reader = queries, conditions, facts_reader

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        rule = parser.add_mutually_exclusive_group(required=True)
        rule.add_argument("--rule", dest="rule_id", type=int)
        rule.add_argument("--condition", dest="conditions", action="append", help=CONDITION_HELP)

    def read(self, arguments: Namespace, caller: Caller) -> RuleTrial:
        facts = self.facts_reader.read(self.queries.query(Task).find(arguments.task_id))
        if arguments.rule_id is None:
            return RuleTrial.tried(UNSAVED_RULE_NAME, arguments.task_id, RuleArguments.conditions(arguments), facts)
        rule = self.queries.query(AssignRule).find(arguments.rule_id)
        return RuleTrial.tried(f"rule {rule.id}", arguments.task_id, self.conditions.lines(rule), facts)
