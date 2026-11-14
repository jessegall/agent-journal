from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.plans.commands.check_plan.check_plan import CheckPlan
from core.modules.plans.support.early_run import EarlyRun


class CheckPlanSubcommand(Subcommand[CheckPlan, EarlyRun]):
    """`journal plan check <plan>`: runs the tests of the tasks in testing of the plan's next checkpoint now,
    before its window is done; the phases after the checkpoint stay closed until the window itself passed."""

    cli_name = "plan"
    name = "check"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> CheckPlan:
        return CheckPlan(arguments.plan_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, EarlyRun):
            output.write(value.line, value.json())
