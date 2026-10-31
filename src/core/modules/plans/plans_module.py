from core.modules.plans.commands.block_plan import BlockPlan
from core.modules.plans.commands.cancel_plan import CancelPlan
from core.modules.plans.guards.phase_position_guard import PhasePositionGuard
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.listeners.cancel_open_plan_tasks_listener import CancelOpenPlanTasksListener
from core.modules.plans.listeners.phase_renumbering_listener import PhaseRenumberingListener
from core.modules.plans.listeners.forget_place_listener import ForgetPlaceListener
from core.modules.plans.listeners.next_plan_task_starter_listener import NextPlanTaskStarterListener
from core.modules.plans.migrations.m002_paused_plans_blocked import PausedPlansBlockedMigration
from core.modules.plans.migrations.m001_plans import PlansTablesMigration
from core.modules.plans.commands.make_phase_handler import MakePhaseHandler
from core.modules.plans.commands.move_phase_handler import MovePhaseHandler
from core.modules.plans.commands.place_phase_handler import PlacePhaseHandler
from core.modules.plans.commands.make_phase_subcommand import MakePhaseSubcommand
from core.modules.plans.commands.move_phase_subcommand import MovePhaseSubcommand
from core.modules.plans.commands.place_phase_subcommand import PlacePhaseSubcommand
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.commands.plan_progress_subcommand import PlanProgressSubcommand
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.queries.plan_query import PlanQuery
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.plan import Plan

PLAN_COMMANDS = (BlockPlan, CancelPlan)


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "journal.core.plans"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks"]
    models = (ModelDeclaration(Plan, query=PlanQuery, commands=PLAN_COMMANDS), ModelDeclaration(Phase), ModelDeclaration(PhaseTask, excluded_subcommands=["make", "edit"]))
    migrations = [PlansTablesMigration, PausedPlansBlockedMigration]
    handlers = (MakePhaseHandler, MovePhaseHandler, PlacePhaseHandler)
    subcommands = (MakePhaseSubcommand, MovePhaseSubcommand,
                   PlacePhaseSubcommand, PlanProgressSubcommand)
    views = [PlanTask, PlanProgress]
    guards = [PhasePositionGuard, PlanCloseGuard]
    listeners = (ForgetPlaceListener, PhaseRenumberingListener, CancelOpenPlanTasksListener,
                 NextPlanTaskStarterListener)
    windows = [WindowDeclaration("plans.plans", "Plans", "plans.js", WindowLoading.COMPONENT, icon=WindowIcon.PLAN, reads=["plan list", "plan show", "plan progress", "phase list"],
                                 events=["plan.*", "phase.*"])]
