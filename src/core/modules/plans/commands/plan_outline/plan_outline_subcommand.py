from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.support.plan_outline import PlanOutline
from core.modules.plans.support.plan_outlines import PlanOutlines


class PlanOutlineSubcommand(ReadSubcommand[PlanOutline]):
    """`journal plan outline <plan>`: the plan's phases, each with its tasks, in one answer."""

    cli_name = "plan"
    name = "outline"

    def __init__(self, outlines: PlanOutlines) -> None:
        self.outlines = outlines

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanOutline:
        return self.outlines.outline(arguments.plan_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanOutline):
            output.write("\n".join(f"{phase.title}: {len(phase.tasks)} tasks" for phase in value.phases), value.json())
