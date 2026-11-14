from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.commands.approve_plan.approve_plan import ApprovePlan
from core.modules.plans.commands.block_plan.block_plan import BlockPlan
from core.modules.plans.commands.cancel_plan.cancel_plan import CancelPlan
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.commands.rework_plan.return_plan import ReturnPlan
from core.modules.plans.commands.start_plan.start_plan import StartPlan
from core.modules.plans.models.plan import Plan
from core.modules.plans.queries.plan_query import PlanQuery


class PlanModelDeclaration(ModelDeclaration):
    """How the module declares Plan."""

    model = Plan
    query = PlanQuery
    commands = (ApprovePlan, BlockPlan, CancelPlan, ClosePlan, ReturnPlan, StartPlan)
    excluded_subcommands = ["block"]
