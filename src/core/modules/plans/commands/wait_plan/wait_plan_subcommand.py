from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.commands.wait_plan.wait_plan import WaitPlan
from core.modules.plans.models.plan import Plan


class WaitPlanSubcommand(Subcommand[WaitPlan, Plan]):
    """`journal plan block <plan> [--reason "<why>"] [--on plan:<n> ...]`: blocks a started plan; with --on it
    opens by itself once every plan it waits on is completed or cancelled."""

    cli_name = "plan"
    name = "block"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)
        parser.add_argument("--reason", default="")
        parser.add_argument("--on", action="append", default=[], help="a plan that opens this one once it ends, written plan:<n>; repeat it for each plan")

    def command(self, arguments: Namespace, caller: Caller) -> WaitPlan:
        return WaitPlan(arguments.plan_id, arguments.reason, tuple(arguments.on))
