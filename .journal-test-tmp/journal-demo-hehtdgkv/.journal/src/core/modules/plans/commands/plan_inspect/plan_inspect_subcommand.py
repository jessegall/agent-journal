from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_inspection import PlanInspection
from core.modules.plans.support.plan_outlines import PlanOutlines


class PlanInspectSubcommand(ReadSubcommand[PlanInspection]):
    """`journal plan inspect <plan>`: a plan with its phases and tasks and how far it has come, in one answer.
    """

    cli_name = "plan"
    name = "inspect"

    def __init__(self, queries: Queries, outlines: PlanOutlines) -> None:
        self.queries, self.outlines = queries, outlines

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanInspection:
        return PlanInspection(self.queries.query(Plan).find(arguments.plan_id), self.outlines.outline(arguments.plan_id))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanInspection):
            output.write(f"plan {value.plan.id}: {value.plan.title}, {len(value.outline.phases)} phases", value.json())
