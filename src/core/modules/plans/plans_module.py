from core.modules.plans.needs.plan_context_needs import PlanContextNeeds
from core.modules.plans.lines.plan_context_lines import PlanContextLines
from core.modules.plans.lines.plan_focus_lines import PlanFocusLines
from core.modules.plans.lines.plan_order_lines import PlanOrderLines
from core.modules.plans.lines.plan_state_lines import PlanStateLines
from core.modules.plans.lines.plan_task_end_lines import PlanTaskEndLines
from core.modules.plans.windows.extensions.chat_running_agents_extension import ChatRunningAgentsExtension
from core.modules.plans.windows.plans_windows import PLANS_WINDOWS
from core.modules.plans.models.declarations.plan_model_declaration import PlanModelDeclaration
from core.modules.plans.models.declarations.phase_task_model_declaration import PhaseTaskModelDeclaration
from core.modules.plans.models.declarations.plan_context_read_model_declaration import PlanContextReadModelDeclaration
from core.modules.plans.models.declarations.plan_wait_model_declaration import PlanWaitModelDeclaration
from core.modules.plans.models.declarations.checkpoint_reach_model_declaration import CheckpointReachModelDeclaration
from core.modules.plans.models.declarations.checkpoint_pass_model_declaration import CheckpointPassModelDeclaration
from core.modules.plans.docks.plans_docks import PLANS_DOCKS
from core.modules.plans.skills.declarations.plans_skills import PLANS_SKILLS
from core.modules.plans.commands.repair_plan_states.repair_plan_states_handler import RepairPlanStatesHandler
from core.modules.plans.migrations.m012_environment_index import PlanContextReadsEnvironmentIndexMigration
from core.modules.plans.support.plan_settings import PLAN_SETTINGS
from core.modules.plans.migrations.m008_plan_context_reads import PlanContextReadsMigration
from core.modules.plans.migrations.m009_plan_waits import PlanWaitsMigration
from core.modules.plans.commands.wait_plan.wait_plan_handler import WaitPlanHandler
from core.modules.plans.commands.wait_plan.wait_plan_subcommand import WaitPlanSubcommand
from core.modules.plans.listeners.plan_wait_listener import PlanWaitListener
from core.modules.plans.support.block_conditions.plan_context_read import PlanContextRead as PlanContextReadCondition
from core.modules.plans.listeners.next_plan_task_starter_listener import NextPlanTaskStarterListener
from core.modules.plans.listeners.started_task_plan_listener import StartedTaskPlanListener
from core.modules.plans.guards.one_task_phase_guard import OneTaskPhaseGuard
from core.modules.plans.guards.unordered_tasks_guard import UnorderedTasksGuard
from core.modules.plans.step_conditions.plan_brief_set import PlanBriefSet
from core.modules.plans.step_conditions.plan_has_phases import PlanHasPhases
from core.modules.plans.step_conditions.plan_phases_have_tasks import PlanPhasesHaveTasks
from core.modules.plans.step_conditions.plan_tasks_ordered import PlanTasksOrdered
from core.modules.plans.guards.phase_position_guard import PhasePositionGuard
from core.modules.plans.guards.phase_test_guard import PhaseTestGuard
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.listeners.cancel_open_plan_tasks_listener import CancelOpenPlanTasksListener
from core.modules.plans.listeners.phase_renumbering_listener import PhaseRenumberingListener
from core.modules.plans.listeners.forget_place_listener import ForgetPlaceListener
from core.modules.plans.listeners.finished_plan_listener import FinishedPlanListener
from core.modules.plans.listeners.passed_plan_listener import PassedPlanListener
from core.modules.plans.listeners.checkpoint_run_listener import CheckpointRunListener
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run_handler import StartCheckpointRunHandler
from core.modules.plans.listeners.finished_plan_line_listener import FinishedPlanLineListener
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
from core.modules.plans.support.plan_shared_rows import PlanSharedRows
from engine.module.module import Module
from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.models.phase import Phase
from core.modules.plans.upgrade.plans_move import PlansMove
from core.modules.plans.listeners.plan_move_mark_listener import PlanMoveMarkListener
from core.modules.plans.listeners.started_plan_dock_listener import StartedPlanDockListener
from core.modules.plans.listeners.ready_plan_sync_listener import ReadyPlanSyncListener
from core.modules.plans.commands.plan_timeline.plan_timeline_subcommand import PlanTimelineSubcommand
from core.modules.plans.marks.plan_mark import PlanMark
from core.modules.plans.support.plan_nudges import PLAN_NUDGES
from core.modules.plans.seeders.plans_seeder import PlansSeeder
from core.modules.plans.support.block_conditions.plan_approved import PlanApproved
from core.modules.plans.support.block_conditions.plan_finished import PlanFinished
from engine.plan.plan_authors import PlanAuthors
from core.modules.plans.bindings.plan_row_authors import PlanRowAuthors
from core.modules.plans.bindings.focused_block_review_scope import FocusedBlockReviewScope
from core.modules.tasks.support.block_review_scope import BlockReviewScope
from core.modules.plans.commands.choose_plan_focus.choose_plan_focus_handler import ChoosePlanFocusHandler
from core.modules.plans.commands.choose_plan_focus.choose_plan_focus_subcommand import ChoosePlanFocusSubcommand


from core.modules.plans.inspectors.plan_inspector import PlanInspector
from core.modules.plans.commands.assign_plan.assign_plan_handler import AssignPlanHandler
from core.modules.plans.commands.record_plan_agent.record_plan_agent_handler import RecordPlanAgentHandler
from core.modules.plans.commands.assign_plan.assign_plan_subcommand import AssignPlanSubcommand
from core.modules.plans.commands.record_checkpoints.record_checkpoints_handler import RecordCheckpointsHandler
from core.modules.plans.commands.rerun_stale_checkpoints.rerun_stale_checkpoints_handler import RerunStaleCheckpointsHandler
from core.modules.plans.migrations.m013_checkpoint_reviews import CheckpointReviewsMigration
from core.modules.plans.migrations.m014_checkpoint_review_report import CheckpointReviewReportMigration
from core.modules.plans.migrations.m015_agent_commit_reaches import AgentCommitReachesMigration
from core.modules.plans.migrations.m016_plan_assignments import PlanAssignmentsMigration
from core.modules.plans.migrations.m017_plan_context_start_event_unbound import PlanContextStartEventUnboundMigration
from core.modules.plans.migrations.m018_started_plans_keep_no_wait_reason import StartedPlansKeepNoWaitReasonMigration
from core.modules.plans.migrations.m019_phase_person_check import PhasePersonCheckMigration
from core.modules.plans.migrations.m020_phase_person_check_removed import PhasePersonCheckRemovedMigration
from core.modules.plans.migrations.m021_waiting_checkpoints_passed import WaitingCheckpointsPassedMigration
from core.modules.plans.commands.check_plan.check_plan_handler import CheckPlanHandler
from core.modules.plans.commands.check_plan.check_plan_subcommand import CheckPlanSubcommand
from core.modules.plans.guards.checkpoint_run_guard import CheckpointRunGuard
from core.modules.plans.guards.plan_wait_circle_guard import PlanWaitCircleGuard
from core.modules.plans.guards.task_dependency_circle_guard import TaskDependencyCircleGuard
from core.modules.plans.guards.task_wait_circle_guard import TaskWaitCircleGuard
from core.modules.plans.listeners.checkpoint_pass_listener import CheckpointPassListener
from core.modules.plans.listeners.checkpoint_reach_listener import CheckpointReachListener
from core.modules.plans.listeners.started_plan_checkpoints_listener import StartedPlanCheckpointsListener
from core.modules.plans.migrations.m010_checkpoints import CheckpointsMigration
from core.modules.plans.migrations.m011_checkpoint_reach_source import CheckpointReachSourceMigration
from core.modules.plans.tick_handlers.plan_state_sweep_tick_handler import PlanStateSweepTickHandler
from core.modules.plans.buttons.plans_approve_button import PlansApproveButton


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "journal.core.plans"
    settings = PLAN_SETTINGS
    requires_engine = ">=5,<6"
    block_conditions = [PlanApproved, PlanFinished, PlanContextReadCondition]
    bindings = {PlanAuthors: PlanRowAuthors, BlockReviewScope: FocusedBlockReviewScope}
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.chat", "journal.core.docking", "journal.core.drivers", "journal.core.messages", "journal.core.assignments"]
    skills = PLANS_SKILLS
    models = [PlanModelDeclaration, ModelDeclaration(Phase), PhaseTaskModelDeclaration, PlanContextReadModelDeclaration, PlanWaitModelDeclaration, CheckpointReachModelDeclaration, CheckpointPassModelDeclaration]
    migrations = [WaitingCheckpointsPassedMigration, PhasePersonCheckRemovedMigration, PlanAssignmentsMigration, PlansTablesMigration, PausedPlansBlockedMigration, PlanStateIndexMigration, PlanStartTimeMigration, PlanDocumentMigration, AllEnvironmentsPlanStateIndexMigration, PhaseTestCommandMigration, PlanContextReadsMigration, PlanWaitsMigration, CheckpointsMigration, CheckpointReachSourceMigration, PlanContextReadsEnvironmentIndexMigration, CheckpointReviewsMigration, CheckpointReviewReportMigration, AgentCommitReachesMigration, PlanContextStartEventUnboundMigration, StartedPlansKeepNoWaitReasonMigration, PhasePersonCheckMigration]
    tick_handlers = [PlanStateSweepTickHandler]
    handlers = [RepairPlanStatesHandler, CheckPlanHandler, RecordCheckpointsHandler, RerunStaleCheckpointsHandler, StartCheckpointRunHandler, WaitPlanHandler, AssignPlanHandler, RecordPlanAgentHandler, ChoosePlanFocusHandler, MakePhaseHandler, MakePlannedTaskHandler, MovePhaseHandler, PlacePhaseHandler]
    moves = [PlansMove]
    subcommands = [CheckPlanSubcommand, WaitPlanSubcommand, AssignPlanSubcommand, ChoosePlanFocusSubcommand, PlanTimelineSubcommand, PlanBoardSubcommand, PlanPlacesSubcommand, PlanOutlineSubcommand, PlanPlaceSubcommand, PlanInspectSubcommand, MakePhaseSubcommand, MovePhaseSubcommand,
                   PlacePhaseSubcommand, PlanProgressSubcommand, MakeTaskSubcommand]
    views = [PlanTask, PlanProgress, PlanCard, PlanOutlineTask, PlanEventRow]
    guards = [CheckpointRunGuard, PhasePositionGuard, PhaseTestGuard, PlanCloseGuard, OneTaskPhaseGuard, UnorderedTasksGuard, TaskWaitCircleGuard, TaskDependencyCircleGuard, PlanWaitCircleGuard]
    step_conditions = [PlanBriefSet, PlanHasPhases, PlanPhasesHaveTasks, PlanTasksOrdered]
    listeners = [CheckpointReachListener, StartedPlanCheckpointsListener, CheckpointPassListener, PlanWaitListener, TaskPlanRowsListener, ForgetPlaceListener, PhaseRenumberingListener, CancelOpenPlanTasksListener,
                 FinishedPlanListener, PassedPlanListener, CheckpointRunListener, FinishedPlanLineListener, PlanMoveMarkListener, StartedPlanDockListener, StartedTaskPlanListener, NextPlanTaskStarterListener, ReadyPlanSyncListener]
    marks = [PlanMark]
    nudges = PLAN_NUDGES
    needs = [PlanContextNeeds]
    lines = [PlanContextLines, PlanFocusLines, PlanOrderLines, PlanStateLines, PlanTaskEndLines]
    docks = PLANS_DOCKS
    window_extensions = [ChatRunningAgentsExtension]
    buttons = [PlansApproveButton]
    windows = PLANS_WINDOWS
    inspectors = [PlanInspector]

    shared_rows = [PlanSharedRows]
    seeders = [PlansSeeder]
