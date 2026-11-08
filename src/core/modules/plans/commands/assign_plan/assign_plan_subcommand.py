from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.plans.models.plan import Plan


class AssignPlanSubcommand(Subcommand[AssignPlan, Plan]):
    """`journal plan assign <plan> [--worker <n>]`: the plan and its open tasks go to the worker, or to the
    main agent."""

    cli_name = "plan"
    name = "assign"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)
        parser.add_argument("--worker", dest="worker_id", type=int, default=None, help="the worker that takes the plan; the main agent when not named")

    def command(self, arguments: Namespace, caller: Caller) -> AssignPlan:
        return AssignPlan(arguments.plan_id, arguments.worker_id)
