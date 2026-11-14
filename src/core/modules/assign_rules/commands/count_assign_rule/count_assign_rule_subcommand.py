from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.assign_rules.support.rule_arguments import CONDITION_HELP, RuleArguments
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.assign_rules.support.trial.recent_matches import RECENT_TASKS, RecentMatches
from core.modules.tasks.models.task import Task


class CountAssignRuleSubcommand(ReadSubcommand[RecentMatches]):
    """`journal assign-rule recent --condition ...`: a dry run that says how many of the 20 newest tasks of the
    environment an unsaved rule would have taken; it assigns nothing and records nothing."""

    cli_name = "assign-rule"
    name = "recent"

    def __init__(self, queries: Queries, facts_reader: TaskFactsReader) -> None:
        self.queries, self.facts_reader = queries, facts_reader

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--condition", dest="conditions", action="append", required=True, help=CONDITION_HELP)

    def read(self, arguments: Namespace, caller: Caller) -> RecentMatches:
        conditions = RuleArguments.conditions(arguments)
        facts = self.facts_reader.read_many(self.queries.query(Task).newest().take(RECENT_TASKS))
        return RecentMatches(len(facts), sum(1 for task_facts in facts if all(condition.matches(task_facts) for condition in conditions)))
