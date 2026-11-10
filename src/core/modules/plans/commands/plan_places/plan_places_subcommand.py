from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.queries.plan_query import PlanQuery

PLACES_REASON = "Every phase of the newest unclosed plans is a place a task can go to, with the tasks already in it."


class PlanPlacesSubcommand(ReadSubcommand[RowList]):
    """Reads the phases of open plans and the tasks placed in them for a task's plan picker."""

    row_line = "{label}"
    empty_line = "no plan places"
    cli_name = "plan"
    name = "places"
    environment_refusal = "plan places are shown for one environment"

    def __init__(self, plans: PlanQuery, queries: Queries) -> None:
        self.plans, self.queries = plans, queries

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        plans = tuple(self.plans.unclosed().newest().limited(PAGE_SIZE_ROWS))
        if not plans:
            return RowList([])
        phases = tuple(self.queries.query(Phase).matching(Among("plan_id", [plan.id for plan in plans])).ordered("position").full_table(PLACES_REASON).all_rows())
        tasks = tuple(self.queries.query(PlanTask).matching(Among("plan_id", [plan.id for plan in plans])).full_table(PLACES_REASON).all_rows())
        return RowList([{"id": phase.id, "label": f"Plan {plan.id}: {plan.title} › {phase.title}",
                         "task_ids": [task.task_id for task in tasks if task.phase_id == phase.id]}
                        for plan in plans for phase in phases if phase.plan_id == plan.id])
