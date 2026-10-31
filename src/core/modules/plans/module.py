from core.modules.plans.plan_block import PlanBlock
from core.modules.plans.plan_cancel import PlanCancel
from core.modules.plans.guards.phase_position_guard import PhasePositionGuard
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.listeners.cancel_open_plan_tasks import CancelOpenPlanTasks
from core.modules.plans.listeners.phase_renumbering import PhaseRenumbering
from core.modules.plans.listeners.forget_place import ForgetPlace
from core.modules.plans.listeners.next_plan_task_starter import NextPlanTaskStarter
from core.modules.plans.migrations.m002_paused_plans_blocked import PausedPlansBlocked
from core.modules.plans.migrations.m001_plans import PlansTables
from core.modules.plans.phase_make_handler import PhaseMakeHandler
from core.modules.plans.phase_move_handler import PhaseMoveHandler
from core.modules.plans.phase_place_handler import PhasePlaceHandler
from core.modules.plans.phase_make_subcommand import PhaseMakeSubcommand
from core.modules.plans.phase_move_subcommand import PhaseMoveSubcommand
from core.modules.plans.phase_place_subcommand import PhasePlaceSubcommand
from core.modules.plans.plan_progress import PlanProgress
from core.modules.plans.plan_progress_subcommand import PlanProgressSubcommand
from core.modules.plans.plan_task import PlanTask
from core.modules.plans.plan_query import PlanQuery
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
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
    guards = [PhasePositionGuard, PlanCloseGuard]
    listeners = (ForgetPlace, PhaseRenumbering, CancelOpenPlanTasks,
                 NextPlanTaskStarter)
    windows = [WindowDeclaration("plans.plans", "Plans", "plans.js", WindowLoading.PAGE, reads=["plan list", "plan show", "plan progress", "phase list"],
                                 events=["plan.*", "phase.*"])]
