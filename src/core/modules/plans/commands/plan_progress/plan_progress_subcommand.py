from argparse import ArgumentParser, Namespace
from core.base.query.queries import Queries
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.plan_progress import PlanProgress


class PlanProgressSubcommand(ReadSubcommand[PlanProgress]):
    """`journal plan progress <plan>`: the plan's task counts and its current phase."""

    cli_name = "plan"
    name = "progress"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanProgress:
        return self.queries.query(PlanProgress).find(arguments.plan_id)
