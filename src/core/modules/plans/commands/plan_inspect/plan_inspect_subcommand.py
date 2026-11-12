from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan import Plan
from core.modules.assignments.support.assignments import Assignments
from core.modules.plans.support.plan_inspection import PlanInspection
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.plans.support.plan_waits import PlanWaits


class PlanInspectSubcommand(ReadSubcommand[PlanInspection]):
    """`journal plan inspect <plan>`: a plan with its phases and tasks and how far it has come, in one answer.
    """

    cli_name = "plan"
    name = "inspect"

    def __init__(self, queries: Queries, outlines: PlanOutlines, waits: PlanWaits, assignments: Assignments) -> None:
        self.queries, self.outlines, self.waits, self.assignments = queries, outlines, waits, assignments

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanInspection:
        plan = self.queries.query(Plan).find(arguments.plan_id)
        assignee = self.assignments.agent(plan)
        blocker_ids = tuple(wait.blocker_id for wait in self.waits.open_waits(plan.id))
        return PlanInspection(plan, self.outlines.outline(arguments.plan_id), assignee, blocker_ids, self.queries.query(PlanProgress).find(plan.id).complexity)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanInspection):
            complexity = "" if value.complexity is None else f", complexity {value.complexity}"
            output.write(f"plan {value.plan.id}: {value.plan.title}, {len(value.outline.phases)} phases{complexity}", value.json())
