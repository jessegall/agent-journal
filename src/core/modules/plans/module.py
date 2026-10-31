from core.modules.plans.commands import PlanBlock, PlanCancel
from core.modules.plans.guards.phase_position_by_move import PhasePositionByMove
from core.modules.plans.listeners.cancel_open_plan_tasks import CancelOpenPlanTasks
from core.modules.plans.listeners.phase_renumbering import PhaseRenumbering
from core.modules.plans.listeners.forget_place import ForgetPlace
from core.modules.plans.listeners.next_plan_task_starter import NextPlanTaskStarter
from core.modules.plans.migrations.m002_paused_plans_blocked import PausedPlansBlocked
from core.modules.plans.migrations.m001_plans import PlansTables
from core.modules.plans.phase_handlers import PhaseMakeHandler, PhaseMoveHandler, PhasePlaceHandler
from core.modules.plans.phase_subcommands import PhaseMakeSubcommand, PhaseMoveSubcommand, PhasePlaceSubcommand
from core.modules.plans.plan_progress import PlanProgress, PlanProgressSubcommand
from core.modules.plans.plan_task import PlanTask
from core.modules.plans.plan_query import PlanQuery
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.plans.phase import Phase
from core.modules.plans.phase_task import PhaseTask
from core.modules.plans.plan import Plan

PLAN_COMMANDS = (PlanBlock, PlanCancel)


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "journal.core.plans"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks"]
    models = (ModelDeclaration(Plan, query=PlanQuery, commands=PLAN_COMMANDS), ModelDeclaration(Phase), ModelDeclaration(PhaseTask, excluded_subcommands=["make", "edit"]))
    migrations = [PlansTables, PausedPlansBlocked]
    handlers = (PhaseMakeHandler, PhaseMoveHandler, PhasePlaceHandler)
    subcommands = (PhaseMakeSubcommand, PhaseMoveSubcommand,
                   PhasePlaceSubcommand, PlanProgressSubcommand)
    views = [PlanTask, PlanProgress]
    guards = [PhasePositionByMove]
    listeners = (ForgetPlace, PhaseRenumbering, CancelOpenPlanTasks,
                 NextPlanTaskStarter)
