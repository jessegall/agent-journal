from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.query.queries import Queries
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import ReadSubcommand


@dataclass(frozen=True, kw_only=True)
class PlanProgress(ViewModel):
    """How far a plan is: its tasks not cancelled, its tasks completed, and the first phase with a task open, read
    from the plan_progress view, the one place these counts are worked out."""

    cli_name = "plan"
    view = "plan_progress"
    key = "plan_id"

    plan_id: int
    task_count: int
    completed_count: int
    current_phase: int


class PlanProgressSubcommand(ReadSubcommand[PlanProgress]):
    """`journal plan progress <plan>`: the plan's task counts and its current phase."""

    cli_name = "plan"
    name = "progress"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanProgress:
        return self.queries.view_query(PlanProgress).find(arguments.plan_id)
