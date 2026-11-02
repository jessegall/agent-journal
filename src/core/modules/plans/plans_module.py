from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.plans.commands.block_plan.block_plan import BlockPlan
from core.modules.plans.commands.cancel_plan.cancel_plan import CancelPlan
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.guards.phase_position_guard import PhasePositionGuard
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.listeners.cancel_open_plan_tasks_listener import CancelOpenPlanTasksListener
from core.modules.plans.listeners.phase_renumbering_listener import PhaseRenumberingListener
from core.modules.plans.listeners.forget_place_listener import ForgetPlaceListener
from core.modules.plans.listeners.finished_plan_listener import FinishedPlanListener
from core.modules.plans.migrations.m002_paused_plans_blocked import PausedPlansBlockedMigration
from core.modules.plans.migrations.m001_plans import PlansTablesMigration
from core.modules.plans.commands.make_phase.make_phase_handler import MakePhaseHandler
from core.modules.plans.commands.move_phase.move_phase_handler import MovePhaseHandler
from core.modules.plans.commands.place_phase.place_phase_handler import PlacePhaseHandler
from core.modules.plans.commands.make_phase.make_phase_subcommand import MakePhaseSubcommand
from core.modules.plans.commands.plan_board.plan_board_subcommand import PlanBoardSubcommand
from core.modules.plans.commands.plan_outline.plan_outline_subcommand import PlanOutlineSubcommand
from core.modules.plans.commands.plan_inspect.plan_inspect_subcommand import PlanInspectSubcommand
from core.modules.plans.commands.plan_place.plan_place_subcommand import PlanPlaceSubcommand
from core.modules.plans.commands.move_phase.move_phase_subcommand import MovePhaseSubcommand
from core.modules.plans.commands.place_phase.place_phase_subcommand import PlacePhaseSubcommand
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_card import PlanCard
from core.modules.plans.migrations.m003_plan_state_index import PlanStateIndexMigration
from core.modules.plans.migrations.m004_plan_start_time import PlanStartTimeMigration
from core.modules.plans.commands.plan_progress.plan_progress_subcommand import PlanProgressSubcommand
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.plan_shared_rows import PlanSharedRows
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.upgrade.plans_move import PlansMove
from core.modules.plans.commands.comment_plan.comment_plan_subcommand import CommentPlanSubcommand
from core.modules.plans.commands.plan_comments.plan_comments_subcommand import PlanCommentsSubcommand
from core.modules.plans.models.plan import Plan
from core.modules.plans.listeners.plan_move_mark_listener import PlanMoveMarkListener
from core.modules.plans.listeners.started_plan_dock_listener import StartedPlanDockListener
from core.modules.plans.commands.plan_timeline.plan_timeline_subcommand import PlanTimelineSubcommand
from core.modules.plans.rules.plan_order_rule import PlanOrderRule
from core.modules.plans.rules.plan_state_rule import PlanStateRule
from core.modules.plans.rules.plan_task_line_rule import PlanTaskLineRule
from core.modules.plans.support.plan_marks import PLAN_DOCKS, PLAN_MARKS
from core.modules.plans.support.plan_nudges import PLAN_NUDGES
from core.modules.plans.seeders.plans_seeder import PlansSeeder
from core.modules.plans.support.block_conditions.plan_approved import PlanApproved
from core.modules.plans.support.block_conditions.plan_finished import PlanFinished

PLAN_COMMANDS = (BlockPlan, CancelPlan, ClosePlan)


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "journal.core.plans"
    requires_core = ">=5,<6"
    block_conditions = [PlanApproved, PlanFinished]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.chat", "journal.core.docking", "journal.core.drivers"]
    skills = [SkillDeclaration("journal-plans", "Build and follow a plan of ordered tasks; read it before the first plan command of a session, or when the user asks for a plan or a roadmap", keywords=("plan", "plans", "roadmap", "phases"), commands=("plan", "phase"))]
    models = (ModelDeclaration(Plan, query=PlanQuery, commands=PLAN_COMMANDS), ModelDeclaration(Phase), ModelDeclaration(PhaseTask, excluded_subcommands=["make", "edit"]))
    migrations = [PlansTablesMigration, PausedPlansBlockedMigration, PlanStateIndexMigration, PlanStartTimeMigration]
    handlers = (MakePhaseHandler, MovePhaseHandler, PlacePhaseHandler)
    moves = [PlansMove]
    subcommands = (CommentPlanSubcommand, PlanCommentsSubcommand, PlanTimelineSubcommand, PlanBoardSubcommand, PlanOutlineSubcommand, PlanPlaceSubcommand, PlanInspectSubcommand, MakePhaseSubcommand, MovePhaseSubcommand,
                   PlacePhaseSubcommand, PlanProgressSubcommand)
    views = [PlanTask, PlanProgress, PlanCard]
    guards = [PhasePositionGuard, PlanCloseGuard]
    listeners = (ForgetPlaceListener, PhaseRenumberingListener, CancelOpenPlanTasksListener,
                 FinishedPlanListener, PlanMoveMarkListener, StartedPlanDockListener)
    marks = PLAN_MARKS
    nudges = PLAN_NUDGES
    driver_rules = [PlanTaskLineRule, PlanStateRule, PlanOrderRule]
    docks = PLAN_DOCKS
    windows = [WindowDeclaration("plans.plans", "Plans", "plans.js", WindowLoading.COMPONENT, icon=WindowIcon.PLAN, reads=["plan board", "task list", "plan list", "plan show", "plan progress", "plan outline", "plan inspect", "phase list", "phase show"],
                                 events=["plan.*", "phase.*", "task.*"], shared_reads=["plan show id", "plan progress plan_id", "phase list plan", "phase show id"])]
    shared_rows = [PlanSharedRows]
    seeders = [PlansSeeder]
