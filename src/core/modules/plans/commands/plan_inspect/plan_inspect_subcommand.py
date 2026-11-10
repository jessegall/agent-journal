from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_assignee import PlanAssignee
from core.modules.plans.support.plan_inspection import PlanInspection
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.plans.support.plan_waits import PlanWaits


class PlanInspectSubcommand(ReadSubcommand[PlanInspection]):
    """`journal plan inspect <plan>`: a plan with its phases and tasks and how far it has come, in one answer.
    """

    cli_name = "plan"
    name = "inspect"

    def __init__(self, queries: Queries, outlines: PlanOutlines, waits: PlanWaits) -> None:
        self.queries, self.outlines, self.waits = queries, outlines, waits

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanInspection:
        plan = self.queries.query(Plan).find(arguments.plan_id)
        assignee_id = PlanAssignee.agent_id(plan)
        assignee = self.queries.query(Agent).find(assignee_id) if assignee_id is not None else None
        blocker_ids = tuple(wait.blocker_id for wait in self.waits.open_waits(plan.id))
        return PlanInspection(plan, self.outlines.outline(arguments.plan_id), assignee, blocker_ids)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanInspection):
            output.write(f"plan {value.plan.id}: {value.plan.title}, {len(value.outline.phases)} phases", value.json())
