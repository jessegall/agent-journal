from core.base.skill.skill_declaration import SkillDeclaration
from core.base.module.model_declaration import ALL_SUBCOMMANDS
from core.modules.plans.migrations.m008_plan_context_reads import PlanContextReadsMigration
from core.modules.plans.migrations.m009_plan_waits import PlanWaitsMigration
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.plans.commands.wait_plan.wait_plan_handler import WaitPlanHandler
from core.modules.plans.commands.wait_plan.wait_plan_subcommand import WaitPlanSubcommand
from core.modules.plans.listeners.plan_wait_listener import PlanWaitListener
from core.modules.plans.models.plan_context_read import PlanContextRead
from core.modules.plans.support.block_conditions.plan_context_read import PlanContextRead as PlanContextReadCondition
from core.modules.plans.rules.plan_context_rule import PlanContextRule
from core.base.viewer.button_declaration import ButtonCondition, ButtonDeclaration, ButtonMenuItem, TextField
from core.modules.plans.commands.block_plan.block_plan import BlockPlan
from core.modules.plans.commands.rework_plan.return_plan import ReturnPlan
from core.modules.plans.commands.approve_plan.approve_plan import ApprovePlan
from core.modules.plans.commands.cancel_plan.cancel_plan import CancelPlan
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.commands.start_plan.start_plan import StartPlan
from core.modules.plans.listeners.next_plan_task_starter_listener import NextPlanTaskStarterListener
from core.modules.plans.listeners.started_task_plan_listener import StartedTaskPlanListener
from core.modules.plans.guards.one_task_phase_guard import OneTaskPhaseGuard
from core.modules.plans.guards.unordered_tasks_guard import UnorderedTasksGuard
from core.modules.plans.step_conditions.plan_brief_set import PlanBriefSet
from core.modules.plans.step_conditions.plan_has_phases import PlanHasPhases
from core.modules.plans.step_conditions.plan_phases_have_tasks import PlanPhasesHaveTasks
from core.modules.plans.step_conditions.plan_tasks_ordered import PlanTasksOrdered
from core.modules.plans.guards.phase_position_guard import PhasePositionGuard
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.listeners.cancel_open_plan_tasks_listener import CancelOpenPlanTasksListener
from core.modules.plans.listeners.phase_renumbering_listener import PhaseRenumberingListener
from core.modules.plans.listeners.forget_place_listener import ForgetPlaceListener
from core.modules.plans.listeners.finished_plan_listener import FinishedPlanListener
from core.modules.plans.listeners.task_plan_rows_listener import TaskPlanRowsListener
from core.modules.plans.migrations.m002_paused_plans_blocked import PausedPlansBlockedMigration
from core.modules.plans.migrations.m001_plans import PlansTablesMigration
from core.modules.plans.commands.make_phase.make_phase_handler import MakePhaseHandler
from core.modules.plans.commands.make_planned_task.make_planned_task_handler import MakePlannedTaskHandler
from core.modules.plans.commands.make_planned_task.make_task_subcommand import MakeTaskSubcommand
from core.modules.plans.commands.move_phase.move_phase_handler import MovePhaseHandler
from core.modules.plans.commands.place_phase.place_phase_handler import PlacePhaseHandler
from core.modules.plans.commands.make_phase.make_phase_subcommand import MakePhaseSubcommand
from core.modules.plans.commands.plan_board.plan_board_subcommand import PlanBoardSubcommand
from core.modules.plans.commands.plan_places.plan_places_subcommand import PlanPlacesSubcommand
from core.modules.plans.commands.plan_outline.plan_outline_subcommand import PlanOutlineSubcommand
from core.modules.plans.commands.plan_inspect.plan_inspect_subcommand import PlanInspectSubcommand
from core.modules.plans.commands.plan_place.plan_place_subcommand import PlanPlaceSubcommand
from core.modules.plans.commands.move_phase.move_phase_subcommand import MovePhaseSubcommand
from core.modules.plans.commands.place_phase.place_phase_subcommand import PlacePhaseSubcommand
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_card import PlanCard
from core.modules.plans.migrations.m003_plan_state_index import PlanStateIndexMigration
from core.modules.plans.migrations.m004_plan_start_time import PlanStartTimeMigration
from core.modules.plans.migrations.m005_plan_document import PlanDocumentMigration
from core.modules.plans.migrations.m006_all_environments_plan_state_index import AllEnvironmentsPlanStateIndexMigration
from core.modules.plans.migrations.m007_phase_test_command import PhaseTestCommandMigration
from core.modules.plans.commands.plan_progress.plan_progress_subcommand import PlanProgressSubcommand
from core.modules.plans.models.plan_event_row import PlanEventRow
from core.modules.plans.models.plan_outline_task import PlanOutlineTask
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.plan_shared_rows import PlanSharedRows
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_extension import WindowExtension
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_tab import WindowTab
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.upgrade.plans_move import PlansMove
from core.modules.plans.models.plan import Plan
from core.modules.plans.listeners.plan_move_mark_listener import PlanMoveMarkListener
from core.modules.plans.listeners.started_plan_dock_listener import StartedPlanDockListener
from core.modules.plans.listeners.ready_plan_sync_listener import ReadyPlanSyncListener
from core.modules.plans.commands.plan_timeline.plan_timeline_subcommand import PlanTimelineSubcommand
from core.modules.plans.rules.plan_order_rule import PlanOrderRule
from core.modules.plans.rules.plan_state_rule import PlanStateRule
from core.modules.plans.rules.plan_task_line_rule import PlanTaskLineRule
from core.modules.plans.support.plan_marks import PLAN_DOCKS, PLAN_MARKS
from core.modules.plans.support.plan_nudges import PLAN_NUDGES
from core.modules.plans.seeders.plans_seeder import PlansSeeder
from core.modules.plans.support.block_conditions.plan_approved import PlanApproved
from core.modules.plans.support.block_conditions.plan_finished import PlanFinished
from core.modules.plans.support.skeletons import PLANS_PLANS_SKELETON
from engine.plan.plan_authors import PlanAuthors
from core.modules.plans.bindings.plan_row_authors import PlanRowAuthors

PLAN_COMMANDS = (ApprovePlan, BlockPlan, CancelPlan, ClosePlan, ReturnPlan, StartPlan)

from core.modules.plans.support.plan_inspector import PLAN_INSPECTOR
from core.modules.plans.commands.assign_plan.assign_plan_handler import AssignPlanHandler
from core.modules.plans.commands.assign_plan.assign_plan_subcommand import AssignPlanSubcommand
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_place import WindowPlace


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "journal.core.plans"
    requires_core = ">=5,<6"
    block_conditions = [PlanApproved, PlanFinished, PlanContextReadCondition]
    bindings = {PlanAuthors: PlanRowAuthors}
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.chat", "journal.core.docking", "journal.core.drivers", "journal.core.messages"]
    skills = [SkillDeclaration("journal-plans", "Build and follow a plan of ordered tasks; read it before the first plan command of a session, or when the user asks for a plan or a roadmap", keywords=("plan", "plans", "roadmap", "phases"), commands=("plan", "phase")),
              SkillDeclaration("journal-planning", "Build a thorough plan with real steps in each phase, one task per step, and a brief each worker can carry out alone; read it before you make a plan or a phase", keywords=("plan", "phases"), commands=("plan make", "phase make"))]
    models = [ModelDeclaration(Plan, query=PlanQuery, commands=PLAN_COMMANDS, excluded_subcommands=["block"]), ModelDeclaration(Phase), ModelDeclaration(PhaseTask, excluded_subcommands=["make", "edit"]), ModelDeclaration(PlanContextRead, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(PlanWait, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [PlansTablesMigration, PausedPlansBlockedMigration, PlanStateIndexMigration, PlanStartTimeMigration, PlanDocumentMigration, AllEnvironmentsPlanStateIndexMigration, PhaseTestCommandMigration, PlanContextReadsMigration, PlanWaitsMigration]
    handlers = [WaitPlanHandler, AssignPlanHandler, MakePhaseHandler, MakePlannedTaskHandler, MovePhaseHandler, PlacePhaseHandler]
    moves = [PlansMove]
    subcommands = [WaitPlanSubcommand, AssignPlanSubcommand, PlanTimelineSubcommand, PlanBoardSubcommand, PlanPlacesSubcommand, PlanOutlineSubcommand, PlanPlaceSubcommand, PlanInspectSubcommand, MakePhaseSubcommand, MovePhaseSubcommand,
                   PlacePhaseSubcommand, PlanProgressSubcommand, MakeTaskSubcommand]
    views = [PlanTask, PlanProgress, PlanCard, PlanOutlineTask, PlanEventRow]
    guards = [PhasePositionGuard, PlanCloseGuard, OneTaskPhaseGuard, UnorderedTasksGuard]
    step_conditions = [PlanBriefSet, PlanHasPhases, PlanPhasesHaveTasks, PlanTasksOrdered]
    listeners = [PlanWaitListener, TaskPlanRowsListener, ForgetPlaceListener, PhaseRenumberingListener, CancelOpenPlanTasksListener,
                 FinishedPlanListener, PlanMoveMarkListener, StartedPlanDockListener, StartedTaskPlanListener, NextPlanTaskStarterListener, ReadyPlanSyncListener]
    marks = PLAN_MARKS
    nudges = PLAN_NUDGES
    driver_rules = [PlanTaskLineRule, PlanStateRule, PlanOrderRule, PlanContextRule]
    docks = PLAN_DOCKS
    window_extensions = [WindowExtension("messages.chat", reads=["agent running"])]
    buttons = [ButtonDeclaration("plans.approve", tuple(["row.plan"]), "Approve", "plan approve {row_id}",
                                 icon="check", primary=True, condition=ButtonCondition("state", tuple(["ready"])),
                                 tip="Approve the plan; the agent starts it", menu_label="Other ways to approve",
                                 menu=tuple([ButtonMenuItem("Approve with a message", "plan approve {row_id} --message={message}",
                                                           tuple([TextField("message", "Message to the agent")]),
                                                           "Your message reaches the agent before the plan starts")]))]
    windows = [WindowDeclaration("plans.plans", "Plans", "plans.js", WindowLoading.COMPONENT, skeleton=PLANS_PLANS_SKELETON, icon=WindowIcon.PLAN, reads=["plan board", "task list", "plan list", "plan show", "plan progress", "plan outline", "plan inspect", "plan comments", "link list", "phase list", "phase show"],
                                 events=["plan.*", "phase.*", "task.*"], shared_reads=["plan show id", "plan progress plan_id", "phase list plan", "phase show id"],
                                 keys=[WindowKey("open", "plan board", tab="open", events=["plan.*", "phase.*", "task.*"], arguments=["limit"]),
                                       WindowKey("started", "plan board --started", tab="started", events=["plan.*", "phase.*", "task.*"], arguments=["limit"]),
                                       WindowKey("closed", "plan board --closed", tab="closed", events=["plan.*", "phase.*", "task.*"], arguments=["limit"]),
                                       WindowKey("older-open", "plan board", loading=KeyLoading.REQUESTED, arguments=["before-id"]),
                                       WindowKey("older-closed", "plan board --closed", loading=KeyLoading.REQUESTED, arguments=["before-id"]),
                                       WindowKey("plan.*", "plan show {id}", loading=KeyLoading.REQUESTED)],
                                 tabs=[WindowTab("open", "Open", "plan board", "open_total"), WindowTab("started", "Started", "plan board --started", "started_total"), WindowTab("closed", "Closed", "plan board --closed", "closed_total")]),
               WindowDeclaration("plans.plan-details", "Details", "plan-details.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.PLAN, skeleton=[SkeletonPart.line()]),
               WindowDeclaration("plans.plan-phases", "Phases", "plan-phases.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.PLAN, skeleton=[SkeletonPart.line()]),
               WindowDeclaration("plans.plan-timeline", "Timeline", "plan-timeline.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.PLAN, skeleton=[SkeletonPart.line()],
                                 reads=["plan timeline"], events=["plan.*"])]
    inspectors = [PLAN_INSPECTOR]

    shared_rows = [PlanSharedRows]
    seeders = [PlansSeeder]
