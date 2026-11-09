from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from core.modules.plans.models.plan import Plan


class AssignPlanSubcommand(Subcommand[AssignPlan, Plan]):
    """`journal plan assign <plan> [--phase <phase>] [--to <n>]`: the open and blocked tasks of the plan or
    phase are reserved for the agent named; with none named they are left free for the main agent to pick."""

    cli_name = "plan"
    name = "assign"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)
        parser.add_argument("--to", dest="agent_id", type=int, default=None, help="the agent the tasks are reserved for; left free for the main agent when not named")
        parser.add_argument("--phase", dest="phase_id", type=int, default=None, help="only the tasks of this phase, leaving the plan's agent as it is")

    def command(self, arguments: Namespace, caller: Caller) -> AssignPlan:
        return AssignPlan(arguments.plan_id, arguments.agent_id, arguments.phase_id)
