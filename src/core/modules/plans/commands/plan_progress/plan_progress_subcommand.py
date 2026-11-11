from argparse import ArgumentParser, Namespace
from engine.query.queries import Queries
from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


class PlanProgressSubcommand(ReadSubcommand[PlanProgress]):
    """`journal plan progress <plan>`: the plan's task counts, its current phase and how each checkpoint
    stands."""

    cli_name = "plan"
    name = "progress"

    def __init__(self, queries: Queries, checkpoints: PlanCheckpoints) -> None:
        self.queries, self.checkpoints = queries, checkpoints

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PlanProgress:
        return self.queries.query(PlanProgress).find(arguments.plan_id)

    def write_output(self, value: object, output: Output) -> None:
        super().write_output(value, output)
        if isinstance(value, PlanProgress) and not output.json_output:
            for line in self.checkpoints.status_lines(value.plan_id, self.checkpoints.windows(value.plan_id)):
                output.line(line)
