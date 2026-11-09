from suites.coding.modules.workers.migrations.m047_main_dispatches_workers_key import MainDispatchesWorkersKeyMigration
from suites.coding.modules.workers.migrations.m058_worktree_folder_index import WorktreeFolderIndexMigration
from suites.coding.modules.workers.migrations.m059_proof_creator_index import ProofCreatorIndexMigration
from suites.coding.modules.workers.migrations.m041_worker_mark_cursors import WorkerMarkCursorMigration
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.migrations.m042_worker_operations import WorkerOperationsMigration
from suites.coding.modules.workers.commands.queue_worker_operation.queue_worker_operation_handler import QueueWorkerOperationHandler
from suites.coding.modules.workers.commands.run_worker_operation.claim_worker_operation_handler import ClaimWorkerOperationHandler
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation_handler import RunWorkerOperationHandler
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation_subcommand import RunWorkerOperationSubcommand
from suites.coding.modules.workers.listeners.worker_process_removal_listener import WorkerProcessRemovalListener
from suites.coding.modules.workers.listeners.worker_operation_listener import WorkerOperationListener
from suites.coding.modules.workers.listeners.worker_route_mark_listener import WorkerRouteMarkListener
from suites.coding.modules.workers.listeners.worker_split_mark_listener import WorkerSplitMarkListener
from suites.coding.modules.workers.listeners.task_tag_route_mark_listener import TaskTagRouteMarkListener
from suites.coding.modules.workers.listeners.task_route_mark_listener import TaskRouteMarkListener
from suites.coding.modules.workers.guards.worker_route_guard import WorkerRouteGuard
from suites.coding.modules.workers.guards.worker_route_owner_guard import WorkerRouteOwnerGuard
from suites.coding.modules.workers.guards.worker_route_access_guard import WorkerRouteAccessGuard
from suites.coding.modules.workers.commands.edit_worker_route.edit_worker_route_handler import EditWorkerRouteHandler
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.migrations.m040_worker_routes import WorkerRoutesMigration
from suites.coding.modules.workers.guards.worker_route_shape_guard import WorkerRouteShapeGuard
from suites.coding.modules.workers.commands.worker_route_list.worker_route_list_subcommand import WorkerRouteListSubcommand
from suites.coding.modules.workers.commands.report_worker_route_fallback.report_worker_route_fallback_handler import ReportWorkerRouteFallbackHandler
from suites.coding.modules.workers.commands.make_worker_route.make_worker_route_handler import MakeWorkerRouteHandler
from suites.coding.modules.workers.commands.make_worker_route.make_worker_route_subcommand import MakeWorkerRouteSubcommand
from suites.coding.modules.workers.commands.delete_worker_route.delete_worker_route_handler import DeleteWorkerRouteHandler
from suites.coding.modules.workers.commands.delete_worker_route.delete_worker_route_subcommand import DeleteWorkerRouteSubcommand
from suites.coding.modules.workers.commands.move_worker_route.move_worker_route_handler import MoveWorkerRouteHandler
from suites.coding.modules.workers.commands.move_worker_route.move_worker_route_subcommand import MoveWorkerRouteSubcommand
from suites.coding.modules.workers.commands.edit_worker_route.edit_worker_route_subcommand import EditWorkerRouteSubcommand
from suites.coding.modules.workers.migrations.m038_worktree_route import WorktreeRouteMigration
from suites.coding.modules.workers.migrations.m039_worktree_split_indexes import WorktreeSplitIndexesMigration
from suites.coding.modules.workers.commands.worker_split.worker_split_subcommand import WorkerSplitSubcommand
from suites.coding.modules.workers.bindings.record_worker_recovery_reports import RecordWorkerRecoveryReports
from suites.coding.modules.workers.support.worker_recovery_reports import WorkerRecoveryReports
from core.modules.processes.support.read_commands import ReadCommands
from suites.coding.modules.workers.support.worker_read_commands import WorkerReadCommands
from suites.coding.modules.workers.listeners.worker_log_output_listener import WorkerLogOutputListener
from suites.coding.modules.workers.migrations.m035_worker_log_output import WorkerLogOutputMigration
from suites.coding.modules.workers.migrations.m033_worker_test_groups import WorkerTestGroupsMigration
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun
from suites.coding.modules.workers.migrations.m032_worker_phase_test_runs import WorkerPhaseTestRunsMigration
from suites.coding.modules.workers.commands.record_worker_test_run.record_worker_test_run_handler import RecordWorkerTestRunHandler
from suites.coding.modules.workers.rules.approved_plan_stop_rule import ApprovedPlanStopRule
from core.base.agent_work import AgentWork
from suites.coding.modules.workers.listeners.merger_tests_passed_listener import MergerTestsPassedListener
from suites.coding.modules.workers.bindings.worker_agent_work import WorkerAgentWork
from suites.coding.modules.workers.support.worker_brief_points import WorkerBriefPoints
from core.base.agent_brief_points import AgentBriefPoints
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview
from suites.coding.modules.workers.migrations.m037_worktree_delivery import WorktreeDeliveryMigration
from suites.coding.modules.workers.migrations.m048_worktree_libraries import WorktreeLibrariesMigration
from suites.coding.modules.workers.migrations.m049_workers_start_read_only_helpers_key import WorkersStartHelpersKeyMigration
from suites.coding.modules.workers.migrations.m050_worker_instruction_files_key import WorkerInstructionFilesKeyMigration
from suites.coding.modules.workers.migrations.m051_worker_operation_end_index import WorkerOperationEndIndexMigration
from suites.coding.modules.workers.migrations.m036_merger_line_nudge import MergerLineNudgeMigration
from suites.coding.modules.workers.support.worker_nudges import APPROVED_PLAN_WAIT
from suites.coding.modules.workers.commands.open_kept_worktree.open_kept_worktree_handler import OpenKeptWorktreeHandler
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker_handler import EndInactiveWorkerHandler
from suites.coding.modules.workers.migrations.m026_worktree_new_agent_reason import WorktreeNewAgentReasonMigration
from suites.coding.modules.workers.migrations.m027_worktree_reason_name import WorktreeReasonNameMigration
from suites.coding.modules.workers.migrations.m028_worker_test_failures import WorkerTestFailuresMigration
from suites.coding.modules.workers.migrations.m024_worker_limit_keys import WorkerCapKeysMigration
from suites.coding.modules.workers.migrations.m025_settle_old_workers import RetireOldWorkersMigration
from suites.coding.modules.workers.migrations.m019_worker_logs_read import WorkerLogsReadMigration
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs_handler import ReadWorkerLogsHandler
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs_subcommand import ReadWorkerLogsSubcommand
from suites.coding.modules.workers.migrations.m016_worker_session import WorkerSessionMigration
from core.base.agent_checkouts import AgentCheckouts
from core.base.agent_write_folder import AgentWriteFolder
from suites.coding.modules.workers.support.worker_checkouts import WorkerCheckouts
from suites.coding.modules.workers.support.worker_write_folder import WorkerWriteFolder
from core.base.agent_sandbox_choice import AgentSandboxChoice
from suites.coding.modules.workers.support.worker_sandbox_choice import WorkerSandboxChoice
from suites.coding.modules.workers.commands.switch_worker_sandbox.switch_worker_sandbox_handler import SwitchWorkerSandboxHandler
from suites.coding.modules.workers.commands.switch_worker_sandbox.switch_worker_sandbox_subcommand import SwitchWorkerSandboxSubcommand
from suites.coding.support.shipped_profiles import WORKER_PROFILES
from suites.coding.modules.workers.listeners.silent_worker_line_listener import SilentWorkerLineListener
from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines_handler import SendSilentAgentLinesHandler
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent_handler import ReportSilentAgentHandler
from suites.coding.modules.workers.commands.report_worker_program_recovery.report_worker_program_recovery_handler import ReportWorkerProgramRecoveryHandler
from suites.coding.modules.workers.migrations.m014_worker_queue_read_indexes import WorkerQueueReadIndexesMigration
from suites.coding.modules.workers.migrations.m013_worker_read_indexes import WorkerReadIndexesMigration
from suites.coding.modules.workers.listeners.reader_sample_ready_listener import ReaderSampleReadyListener
from suites.coding.modules.workers.commands.record_worker_report.send_worker_report_subcommand import SendWorkerReportSubcommand
from suites.coding.modules.workers.models.worker_refusal_count import WorkerRefusalCount
from suites.coding.modules.workers.migrations.m006_worker_refusals import WorkerRefusalsMigration
from suites.coding.modules.workers.migrations.m007_process_work import ProofProcessWorkMigration
from suites.coding.modules.workers.listeners.worker_stop_result_listener import WorkerStopResultListener
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal_handler import RecordWorkerRefusalHandler
from suites.coding.modules.workers.commands.clear_worker_refusals.clear_worker_refusals_handler import ClearWorkerRefusalsHandler
from suites.coding.modules.workers.listeners.main_agent_workers_listener import MainAgentWorkersListener
from suites.coding.modules.workers.listeners.blocked_worker_task_listener import BlockedWorkerTaskListener
from suites.coding.modules.workers.listeners.started_worker_task_listener import StartedWorkerTaskListener
from suites.coding.modules.workers.listeners.opened_worker_task_listener import OpenedWorkerTaskListener
from suites.coding.modules.workers.listeners.assigned_worker_task_listener import AssignedWorkerTaskListener
from suites.coding.modules.workers.listeners.worker_help_request_listener import WorkerHelpRequestListener
from suites.coding.modules.workers.listeners.worker_move_mark_listener import WorkerMoveMarkListener
from suites.coding.modules.workers.listeners.worker_merge_block_listener import WorkerMergeBlockListener
from suites.coding.modules.workers.listeners.worker_job_mark_listener import WorkerJobMarkListener
from suites.coding.modules.workers.listeners.worker_assignment_mark_listener import WorkerAssignmentMarkListener
from suites.coding.modules.workers.models.worker_assignment import WorkerAssignment
from suites.coding.modules.workers.migrations.m043_worker_assignments import WorkerAssignmentsMigration
from suites.coding.modules.workers.migrations.m044_merge_requests import MergeRequestsMigration
from suites.coding.modules.workers.models.merge_request import MergeRequest
from suites.coding.modules.workers.models.merge_followup import MergeFollowup
from suites.coding.modules.workers.migrations.m045_merge_followups import MergeFollowupsMigration
from suites.coding.modules.workers.migrations.m046_worktree_starts_program import WorktreeStartsProgramMigration
from suites.coding.modules.workers.commands.record_merge_followup.record_merge_followup_handler import RecordMergeFollowupHandler
from suites.coding.modules.workers.commands.record_followup_step.record_followup_step_handler import RecordFollowupStepHandler
from suites.coding.modules.workers.commands.record_merge_request.record_merge_request_handler import RecordMergeRequestHandler
from suites.coding.modules.workers.listeners.worker_test_request_mark_listener import WorkerTestRequestMarkListener
from suites.coding.modules.workers.listeners.worker_stopped_mark_listener import WorkerStoppedMarkListener
from suites.coding.modules.workers.listeners.worker_help_request_mark_listener import WorkerHelpRequestMarkListener
from suites.coding.modules.workers.listeners.worker_test_mark_listener import WorkerTestMarkListener
from suites.coding.modules.workers.support.worker_marks import WORKER_MARKS
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests_handler import StartWorkerTestsHandler
from suites.coding.modules.workers.listeners.worker_test_listener import WorkerTestListener
from suites.coding.modules.workers.listeners.worker_test_run_listener import WorkerTestRunListener
from suites.coding.modules.workers.migrations.m005_proof_tests import ProofTestsMigration
from suites.coding.modules.workers.migrations.m004_proofs_per_task import ProofsPerTaskMigration
from suites.coding.modules.workers.rules.worker_status_first_rule import WorkerStatusFirstRule
from suites.coding.modules.workers.commands.name_worker_tests.name_worker_tests_handler import NameWorkerTestsHandler
from suites.coding.modules.workers.commands.check_worker_files.check_worker_files_handler import CheckWorkerFilesHandler
from suites.coding.modules.workers.commands.check_worker_files.check_worker_files_subcommand import CheckWorkerFilesSubcommand
from suites.coding.modules.workers.commands.recover_worker_libraries.recover_worker_libraries_handler import RecoverWorkerLibrariesHandler
from suites.coding.modules.workers.commands.recover_worker_libraries.recover_worker_libraries_subcommand import RecoverWorkerLibrariesSubcommand
from suites.coding.modules.workers.commands.judge_worker_test.judge_worker_test_handler import JudgeWorkerTestHandler
from suites.coding.modules.workers.commands.judge_worker_test.judge_worker_test_subcommand import JudgeWorkerTestSubcommand
from suites.coding.modules.workers.commands.ask_main_agent.ask_main_agent_handler import AskMainAgentHandler
from suites.coding.modules.workers.commands.ask_main_agent.ask_main_agent_subcommand import AskMainAgentSubcommand
from suites.coding.modules.workers.listeners.merger_ask_mark_listener import MergerAskMarkListener
from suites.coding.modules.workers.commands.ask_merger.ask_merger_handler import AskMergerHandler
from suites.coding.modules.workers.commands.ask_merger.ask_merger_subcommand import AskMergerSubcommand
from suites.coding.modules.workers.commands.run_worker_test.run_worker_test_handler import RunWorkerTestHandler
from suites.coding.modules.workers.commands.run_worker_test.run_worker_test_subcommand import RunWorkerTestSubcommand
from suites.coding.modules.workers.migrations.m054_worker_test_commands import WorkerTestCommandsMigration
from suites.coding.modules.workers.migrations.m055_merger_line_ask import MergerLineAskMigration
from suites.coding.modules.workers.commands.send_merger_advice.send_merger_advice_handler import SendMergerAdviceHandler
from suites.coding.modules.workers.commands.send_merger_advice.send_merger_advice_subcommand import SendMergerAdviceSubcommand
from suites.coding.modules.workers.guards.merger_message_guard import MergerMessageGuard
from suites.coding.modules.workers.migrations.m056_merger_advice import MergerAdviceMigration
from suites.coding.modules.workers.migrations.m057_merger_visit_closed import MergerVisitClosedMigration
from suites.coding.modules.workers.models.merger_advice import MergerAdvice
from suites.coding.modules.workers.models.merger_visit import MergerVisit
from suites.coding.modules.workers.models.worker_test_command import WorkerTestCommand
from suites.coding.modules.workers.rules.worker_test_line_rule import WorkerTestLineRule
from suites.coding.modules.workers.support.worker_nudges import WORKER_NUDGES
from core.base.skill.skill_declaration import SkillDeclaration
from suites.coding.modules.workers.models.worker_progress import WorkerProgress
from suites.coding.modules.workers.commands.worker_progress.worker_progress_subcommand import WorkerProgressSubcommand
from core.modules.tasks.support.task_assignees import TaskAssignees
from suites.coding.modules.workers.support.worker_task_assignees import WorkerTaskAssignees
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.stalled_worker_tests import StalledWorkerTests
from suites.coding.modules.workers.ticks.stopped_worker_libraries import StoppedWorkerLibraries
from suites.coding.modules.workers.ticks.worker_instruction_refresh import WorkerInstructionRefresh
from suites.coding.modules.workers.listeners.worker_instruction_task_listener import WorkerInstructionTaskListener
from suites.coding.modules.workers.commands.record_worktree_libraries.record_worktree_libraries_handler import RecordWorktreeLibrariesHandler
from suites.coding.modules.workers.ticks.unlaunched_worker_tests import UnlaunchedWorkerTests
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests_handler import QueueStalledTestsHandler
from core.base.viewer.window_icon import WindowIcon
from core.base.module.model_declaration import ModelDeclaration, ALL_SUBCOMMANDS
from core.modules.messages.support.assigned_work_sources import AssignedWorkSources
from suites.coding.modules.workers.bindings.worker_task_sources import WorkerTaskSources
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.migrations.m023_worker_task_sources import WorkerTaskSourcesMigration
from suites.coding.modules.workers.listeners.worker_job_source_listener import WorkerJobSourceListener
from suites.coding.modules.workers.listeners.deleted_worker_source_listener import DeletedWorkerSourceListener
from core.base.module.module import Module
from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.text_field import TextField
from core.base.access import Access
from core.base.helper_type import HelperType
from suites.coding.modules.workers.bindings.worker_roster import WorkerRoster
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.part_visibility import PartVisibility
from suites.coding.modules.workers.support.worker_part_visibility import WorkerPartVisibility
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from suites.coding.modules.workers.bindings.worker_run_waits import WorkerRunWaits
from core.modules.processes.support.run_waits import RunWaits
from suites.coding.modules.workers.listeners.worker_test_count_listener import WorkerTestCountListener
from suites.coding.modules.workers.rules.worker_test_count_rule import WorkerTestCountRule
from suites.coding.modules.workers.support.test_limit_nudges import TEST_COUNT_UNKNOWN, TEST_LIMIT_STOP, TEST_LIMIT_REFUSAL
from suites.coding.modules.workers.migrations.m008_test_limit_setting import WorkerTestSettingMigration
from suites.coding.modules.workers.migrations.m009_report_visibility import ReportVisibilityMigration
from suites.coding.modules.workers.migrations.m010_alias_access import AliasAccessMigration
from suites.coding.modules.workers.migrations.m011_process_owner import ProcessOwnerMigration
from suites.coding.modules.workers.migrations.m012_affected_tests import AffectedTestsMigration
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test_handler import RecordAffectedTestHandler
from suites.coding.modules.workers.upgrade.alias_permissions_move import AliasPermissionsMove
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker_handler import EndGoneWorkerHandler
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line_handler import SendUnfinishedTasksLineHandler
from suites.coding.modules.workers.ticks.gone_worker_recovery import GoneWorkerRecovery
from suites.coding.modules.workers.rules.missing_process_rule import MissingProcessRule
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from suites.coding.modules.workers.bindings.worker_queue_run_workers import WorkerQueueRunWorkers
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_tab import WindowTab
from core.base.viewer.window_extension import WindowExtension
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_source import WindowSource
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_shows import WindowShows
from suites.coding.modules.workers.commands.record_todo_list.record_todo_list_handler import RecordTodoListHandler
from suites.coding.modules.workers.migrations.m002_todo_items import TodoItemsTableMigration
from suites.coding.modules.workers.models.todo_item import TodoItem
from suites.coding.modules.workers.rules.record_todo_list_rule import RecordTodoListRule
from suites.coding.modules.workers.rules.cache_refresh_rule import CacheRefreshRule
from suites.coding.modules.workers.rules.compaction_wake_rule import CompactionWakeRule
from suites.coding.modules.workers.rules.context_size_rule import ContextSizeRule
from suites.coding.modules.workers.rules.context_stop_now_rule import ContextStopNowRule
from suites.coding.modules.workers.rules.context_hard_stop_rule import ContextHardStopRule
from suites.coding.modules.workers.rules.inactive_helper_rule import InactiveHelperRule
from suites.coding.modules.workers.rules.unstarted_worker_rule import UnstartedWorkerRule
from suites.coding.modules.workers.rules.stopped_worker_run_rule import StoppedWorkerRunRule
from suites.coding.modules.workers.rules.stopped_worker_rule import StoppedWorkerRule
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule
from suites.coding.modules.workers.rules.small_batch_rule import SmallBatchRule
from suites.coding.modules.workers.rules.inactive_worker_stop_rule import InactiveWorkerStopRule
from suites.coding.modules.workers.rules.orphan_worktree_rule import OrphanWorktreeRule
from suites.coding.modules.workers.listeners.boot_orphan_worktrees_listener import BootOrphanWorktreesListener
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees_handler import RemoveOrphanWorktreesHandler
from suites.coding.modules.workers.migrations.m015_allowed_models_key import AllowedModelsKeyMigration
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule
from suites.coding.modules.workers.rules.worker_outside_link_rule import WorkerOutsideLinkRule
from suites.coding.modules.workers.rules.protected_folder_rule import ProtectedFolderRule
from suites.coding.modules.workers.rules.helper_allowance_rule import HelperAllowanceRule
from suites.coding.modules.workers.rules.worker_read_rule import WorkerReadRule
from suites.coding.modules.workers.rules.worker_judge_scope_rule import WorkerJudgeScopeRule
from suites.coding.modules.workers.rules.worker_log_due_rule import WorkerLogDueRule
from suites.coding.modules.workers.rules.worker_reuse_rule import WorkerReuseRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from suites.coding.modules.workers.rules.worker_report_rule import WorkerReportRule
from suites.coding.modules.workers.commands.list_injections.list_injections_subcommand import ListInjectionsSubcommand
from suites.coding.modules.workers.commands.send_worker.send_worker_handler import SendWorkerHandler
from suites.coding.modules.workers.commands.send_worker.send_worker_subcommand import SendWorkerSubcommand
from suites.coding.modules.workers.listeners.context_change_wake_listener import ContextChangeWakeListener
from suites.coding.modules.workers.listeners.compacted_worker_listener import CompactedWorkerListener
from suites.coding.modules.workers.listeners.ended_worker_job_listener import EndedWorkerJobListener
from suites.coding.modules.workers.listeners.helper_folder_commit_listener import HelperFolderCommitListener
from suites.coding.modules.workers.listeners.published_files_commit_listener import PublishedFilesCommitListener
from suites.coding.modules.workers.listeners.delegated_task_comment_listener import DelegatedTaskCommentListener
from suites.coding.modules.workers.listeners.worker_count_raised_listener import WorkerCountRaisedListener
from suites.coding.modules.workers.listeners.reassigned_task_listener import ReassignedTaskListener
from suites.coding.modules.workers.listeners.ended_worker_listener import EndedWorkerListener
from suites.coding.modules.workers.listeners.removed_worktree_agent_listener import RemovedWorktreeAgentListener
from suites.coding.modules.workers.listeners.worker_run_ended_listener import WorkerRunEndedListener
from suites.coding.modules.workers.listeners.worker_job_resume_listener import WorkerJobResumeListener
from suites.coding.modules.workers.listeners.released_stop_listener import ReleasedStopListener
from suites.coding.modules.workers.listeners.worker_program_listener import WorkerProgramListener
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker_handler import DispatchWorkerHandler
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker_subcommand import DispatchWorkerSubcommand
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree_handler import PrepareWorktreeHandler
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree_subcommand import PrepareWorktreeSubcommand
from suites.coding.modules.workers.commands.merge_worker.merge_worker_handler import MergeWorkerHandler
from suites.coding.modules.workers.commands.merge_worker.merge_worker_subcommand import MergeWorkerSubcommand
from suites.coding.modules.workers.commands.release_worker.release_worker_handler import ReleaseWorkerHandler
from suites.coding.modules.workers.commands.release_worker.release_worker_subcommand import ReleaseWorkerSubcommand
from suites.coding.modules.workers.commands.deliver_task.deliver_task_handler import DeliverTaskHandler
from suites.coding.modules.workers.commands.record_worktree_base.record_worktree_base_handler import RecordWorktreeBaseHandler
from suites.coding.modules.workers.commands.record_worktree_merge.record_worktree_merge_handler import RecordWorktreeMergeHandler
from suites.coding.modules.workers.commands.record_worktree_release.record_worktree_release_handler import RecordWorktreeReleaseHandler
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal_handler import RecordWorktreeRemovalHandler
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree_handler import OpenWorkerWorktreeHandler
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut_handler import RecordWorktreeCutHandler
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening_handler import CancelWorkerOpeningHandler
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task_handler import StartNextWorkerTaskHandler
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task_subcommand import StartNextWorkerTaskSubcommand
from suites.coding.modules.workers.commands.deliver_task.deliver_task_subcommand import DeliverTaskSubcommand
from suites.coding.modules.workers.commands.make_proof.make_proof_handler import MakeProofHandler
from suites.coding.modules.workers.commands.make_proof.make_proof_subcommand import MakeProofSubcommand
from suites.coding.modules.workers.commands.make_proof.edit_proof_subcommand import EditProofSubcommand
from suites.coding.modules.workers.commands.make_proof.revise_proof_subcommand import ReviseProofSubcommand
from suites.coding.modules.workers.commands.short_proof.short_proof_handler import ShortProofHandler
from suites.coding.modules.workers.guards.proof_point_guard import ProofPointGuard
from suites.coding.modules.workers.guards.base_branch_guard import BaseBranchGuard
from suites.coding.modules.workers.guards.merge_proof_guard import MergeProofGuard
from suites.coding.modules.workers.guards.worker_task_guard import WorkerTaskGuard
from suites.coding.modules.workers.rules.delivered_work_stop_rule import DeliveredWorkStopRule
from suites.coding.modules.workers.rules.dispatch_allowance_rule import DispatchAllowanceRule
from suites.coding.modules.workers.rules.merge_checkout_rule import MergeCheckoutRule
from suites.coding.modules.workers.guards.dispatch_branch_guard import DispatchBranchGuard
from suites.coding.modules.workers.guards.dispatch_worker_guard import DispatchWorkerGuard
from suites.coding.modules.workers.guards.main_dispatch_guard import MainDispatchGuard
from suites.coding.modules.workers.guards.main_helper_guard import MainHelperGuard
from suites.coding.modules.workers.guards.main_merge_guard import MainMergeGuard
from suites.coding.modules.workers.guards.worker_helper_guard import WorkerHelperGuard
from suites.coding.modules.workers.migrations.m001_workers import WorkersTablesMigration
from suites.coding.modules.workers.migrations.m003_proofs_worktree_index import ProofsWorktreeIndexMigration
from suites.coding.modules.workers.models.worker_points import WorkerPoints
from suites.coding.modules.workers.models.worker_wait import WorkerWait
from suites.coding.modules.workers.commands.worker_waits.worker_waits_subcommand import WorkerWaitsSubcommand
from suites.coding.modules.workers.commands.worker_points.worker_points_subcommand import WorkerPointsSubcommand
from suites.coding.modules.workers.commands.worker_points.proof_points_subcommand import ProofPointsSubcommand
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest
from suites.coding.modules.workers.rules.phase_test_rule import PhaseTestRule
from suites.coding.modules.workers.commands.ask_worker_test.ask_worker_test_handler import AskWorkerTestHandler
from suites.coding.modules.workers.commands.allow_worker_test.allow_worker_test_handler import AllowWorkerTestHandler
from suites.coding.modules.workers.commands.allow_worker_test.allow_worker_test_subcommand import AllowWorkerTestSubcommand
from suites.coding.modules.workers.commands.use_worker_test.use_worker_test_handler import UseWorkerTestHandler
from suites.coding.modules.workers.commands.restore_worker_tests.restore_worker_tests_handler import RestoreWorkerTestsHandler
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.commands.short_proof.short_proof_subcommand import ShortProofSubcommand
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure_handler import RecordOwnTestFailureHandler
from suites.coding.modules.workers.commands.send_merger_input.send_merger_input_handler import SendMergerInputHandler
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker_handler import MergeNextWorkerHandler
from suites.coding.modules.workers.commands.return_worker.return_worker_handler import ReturnWorkerHandler
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge_handler import ReadNextMergeHandler
from suites.coding.modules.workers.commands.return_unhandled_merger_lines.return_unhandled_merger_lines_handler import ReturnUnhandledMergerLinesHandler
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings_handler import SendMergeFindingsHandler
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report_handler import SendMergerReportHandler
from suites.coding.modules.workers.commands.send_merged_worker_line.send_merged_worker_line_handler import SendMergedWorkerLineHandler
from suites.coding.modules.workers.listeners.merged_worker_line_listener import MergedWorkerLineListener
from suites.coding.modules.workers.commands.start_merger.start_merger_handler import StartMergerHandler
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings_subcommand import SendMergeFindingsSubcommand
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker_subcommand import MergeNextWorkerSubcommand
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge_subcommand import ReadNextMergeSubcommand
from suites.coding.modules.workers.commands.return_worker.return_worker_subcommand import ReturnWorkerSubcommand
from suites.coding.modules.workers.listeners.merger_wake_listener import MergerWakeListener
from suites.coding.modules.workers.migrations.m029_worktree_tests_passed import WorktreeTestsPassedMigration
from suites.coding.modules.workers.migrations.m030_merger_lines import MergerLinesMigration
from suites.coding.modules.workers.migrations.m031_worktree_library_links import WorktreeLibraryLinksMigration
from suites.coding.modules.workers.migrations.m034_worktree_pass_reason import WorktreePassReasonMigration
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE, MERGER_PASSED, WORKER_MERGED
from suites.coding.modules.workers.models.worker_test_failure import WorkerTestFailure
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.listeners.worktree_rows_listener import WorktreeRowsListener
from suites.coding.modules.workers.migrations.m017_starts_helpers_key import StartsHelpersKeyMigration
from suites.coding.modules.workers.migrations.m018_open_worktree_index import OpenWorktreeIndexMigration
from suites.coding.modules.workers.migrations.m020_worktree_merge_commits import WorktreeMergeCommitsMigration
from suites.coding.modules.workers.migrations.m021_proof_phase_test_point import ProofPhaseTestPointMigration
from suites.coding.modules.workers.migrations.m022_worker_test_requests import WorkerTestRequestsMigration
from suites.coding.modules.workers.migrations.m052_plain_column_names import PlainColumnNamesMigration
from suites.coding.modules.workers.migrations.m053_worktree_returned_at import WorkerReturnMigration
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.agent_stops import AgentStops
from suites.coding.modules.workers.support.worker_agent_stops import WorkerAgentStops
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from suites.coding.modules.workers.support.worker_folders import WorkerFolders
from suites.coding.modules.workers.support.worker_sessions import WorkerSessions
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTINGS
from suites.coding.modules.workers.upgrade.workers_move import WorkersMove

WORKTREE_MOVES = [move.name for move in WorktreeLifecycle.moves()]
from suites.coding.modules.workers.commands.worker_models.worker_models_subcommand import WorkerModelsSubcommand
from suites.coding.modules.workers.commands.project_worktree_list.project_worktree_list_subcommand import ProjectWorktreeListSubcommand
from suites.coding.modules.workers.commands.remove_project_worktree.remove_project_worktree_handler import RemoveProjectWorktreeHandler
from suites.coding.modules.workers.commands.remove_project_worktree.remove_project_worktree_subcommand import RemoveProjectWorktreeSubcommand
from suites.coding.modules.workers.support.worker_settings import WORKER_KEPT_LIMIT, WORKER_RUN_LIMIT
from suites.coding.modules.workers.support.skeletons import WORKERS_POINTS_SKELETON, WORKERS_TODOS_SKELETON, WORKERS_WORKERS_SKELETON, WORKERS_WORKTREES_SKELETON


from core.modules.skills.support.skill_projects import SkillProjects
from suites.coding.modules.workers.support.worker_skill_projects import WorkerSkillProjects
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets
from suites.coding.modules.workers.support.worker_task_wait_targets import WorkerTaskWaitTargets
from suites.coding.modules.workers.listeners.worker_task_wait_listener import WorkerTaskWaitListener
from suites.coding.modules.workers.listeners.worker_proof_rows_listener import WorkerProofRowsListener
from suites.coding.modules.workers.listeners.affected_test_rows_listener import AffectedTestRowsListener
from suites.coding.modules.workers.commands.worker_status.worker_status_subcommand import WorkerStatusSubcommand
from suites.coding.modules.workers.support.worker_templates import WORKER_TEMPLATES


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task.
    """

    name = "journal.suites.coding.workers"
    profiles = WORKER_PROFILES
    helper_types = [HelperType("worker", "Worker", access=Access.WRITING, separate_folder=True,
                             default_profile="journal-worker", start_line="journal worker dispatch", roster=WorkerRoster, run_limit_key=WORKER_RUN_LIMIT, kept_limit_key=WORKER_KEPT_LIMIT, job_command=("worker", "send"), job_task_flag="--task")]
    parent_suite = "coding"
    templates = WORKER_TEMPLATES
    window_extensions = [*(WindowExtension(name, reads=["proof list", "worker waits", "worker progress"], runs=["worker send"],
                                          events=["proof.*", "worker_worktree.*"],
                                          key_events={"agents": ["proof.*", "worker_worktree.*"], "limits": ["worker_worktree.*"]},
                                          keys=[WindowKey("waits", "worker waits", events=["agent.*", "task.*", "proof.*", "worker_worktree.*"]),
                                                WindowKey("progress", "worker progress", events=["task.*", "worker_worktree.*"])],
                                          sources=[WindowSource("waits", "worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]),
                                                   WindowSource("progress", "worker progress", ["task.*", "worker_worktree.*"]),
                                                   WindowSource("queue", "proof list --limit 50", ["proof.*"])]) for name in ("agents.agents", "agents.helpers")),
                         WindowExtension("viewer.shell", reads=["worker-worktree points", "worker-worktree list", "proof list"],
                                         runs=["worker send", "worker merge", "worker release"], events=["proof.*", "worker_worktree.*"],
                                         key_events={"usage": ["proof.*", "worker_worktree.*"], "bars": ["proof.*", "worker_worktree.*"]})]
    nudges = [MERGER_LINE_AVAILABLE, APPROVED_PLAN_WAIT, WORKER_MERGED, MERGER_PASSED, *WORKER_NUDGES, TEST_COUNT_UNKNOWN, TEST_LIMIT_STOP, TEST_LIMIT_REFUSAL]
    seed_reason = "a worker needs a git worktree, which a scratch demo has none of"
    requires_core = ">=5,<6"
    settings = WORKER_SETTINGS
    dependencies = ["journal.suites.coding", "journal.core.agents", "journal.core.tasks", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.plugins", "journal.core.processes", "journal.core.chat", "journal.core.messages", "journal.core.documents", "journal.core.usage", "journal.core.aliases", "journal.core.viewer", "journal.core.mcp", "journal.core.waits", "journal.core.reviews", "journal.core.profiles", "journal.core.tools"]
    buttons = [ButtonDeclaration("workers.send-job", tuple(["row.agent"]), "Send the worker a job", "worker send {row_id} --job={job}", icon="send", condition=ButtonCondition("working_role", tuple(["worker"])),
                                 fields=tuple([TextField("job", "What should it do?")])),
               ButtonDeclaration("workers.merge", tuple(["row.agent"]), "Merge the work of the worker", "worker merge {row_id}", icon="branch", primary=True, condition=ButtonCondition("working_role", tuple(["worker"])),
                                 confirm="Merge its work? Each point needs a checked proof."),
               ButtonDeclaration("workers.release", tuple(["row.agent"]), "Release the worker from its task", "worker release {row_id} --reason={reason}", icon="restore", condition=ButtonCondition("working_role", tuple(["worker"])),
                                 fields=tuple([TextField("reason", "Why is it taken off its task?")]))]
    skills = [SkillDeclaration("journal-merger", "The merger's case book: what to check and do for each known case, and the ladder before asking the main agent", keywords=tuple(["merger"]), commands=tuple(["merger"])), SkillDeclaration("journal-workers", "Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one", keywords=("worker", "workers", "worktree"), commands=("worker", "proof"))]
    models = [ModelDeclaration(MergerAdvice, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(MergerVisit, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(WorkerOperation, query=WorkerOperationQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WorkerRoute, excluded_subcommands=["make", "edit", "delete", "list"]), ModelDeclaration(WorkerTestRun, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(WorkerTestCommand, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(AffectedTest, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WorkerRefusalCount), ModelDeclaration(MergerLine, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WorkerTestFailure, excluded_subcommands=["make", "edit", "delete", "show", "list"]), ModelDeclaration(Worktree, query=WorktreeQuery, excluded_subcommands=["make", "edit", "delete", *WORKTREE_MOVES]),
              ModelDeclaration(Proof, query=ProofQuery, excluded_subcommands=["make", "edit", "delete", "revise", "queue", "run"]),
              ModelDeclaration(WorkerTestRequest, excluded_subcommands=["make", "edit", "delete", "allow", "use"]),
              ModelDeclaration(TodoItem, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WorkerTaskSource, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(WorkerAssignment, excluded_subcommands=ALL_SUBCOMMANDS), ModelDeclaration(MergeRequest, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(MergeFollowup, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [MergerVisitClosedMigration, MergerAdviceMigration, MergerLineAskMigration, WorkerTestCommandsMigration, WorkerReturnMigration, PlainColumnNamesMigration, WorkerOperationEndIndexMigration, WorkerInstructionFilesKeyMigration, WorkersStartHelpersKeyMigration, WorktreeLibrariesMigration, MainDispatchesWorkersKeyMigration, WorktreeStartsProgramMigration, MergeFollowupsMigration, MergeRequestsMigration, WorkerAssignmentsMigration, WorkerOperationsMigration, WorkerMarkCursorMigration, WorkerRoutesMigration, WorktreeSplitIndexesMigration, WorktreeRouteMigration, WorkerLogOutputMigration, WorktreePassReasonMigration, WorkerTestGroupsMigration, WorkerPhaseTestRunsMigration, WorktreeDeliveryMigration, WorktreeLibraryLinksMigration, MergerLineNudgeMigration, WorktreeReasonNameMigration, WorkerTestFailuresMigration, WorktreeTestsPassedMigration, MergerLinesMigration, WorktreeNewAgentReasonMigration, RetireOldWorkersMigration, WorkerCapKeysMigration, WorkerTaskSourcesMigration, WorkerTestRequestsMigration, ProofPhaseTestPointMigration, WorktreeMergeCommitsMigration, WorkerLogsReadMigration, StartsHelpersKeyMigration, WorkerSessionMigration, AllowedModelsKeyMigration, WorkerQueueReadIndexesMigration, WorkerReadIndexesMigration, AffectedTestsMigration, ProcessOwnerMigration, ProofProcessWorkMigration, WorkerRefusalsMigration, WorkersTablesMigration, TodoItemsTableMigration, ProofsWorktreeIndexMigration, ProofsPerTaskMigration, ProofTestsMigration, WorkerTestSettingMigration, ReportVisibilityMigration, AliasAccessMigration, OpenWorktreeIndexMigration, WorktreeFolderIndexMigration, ProofCreatorIndexMigration]
    views = [WorkerWorkReview, WorkerPoints, WorkerWait, WorkerProgress]
    moves = [WorkersMove, AliasPermissionsMove]
    handlers = [ReturnUnhandledMergerLinesHandler, SendMergerAdviceHandler, CheckWorkerFilesHandler, RecoverWorkerLibrariesHandler, JudgeWorkerTestHandler, AskMainAgentHandler, AskMergerHandler, SendMergedWorkerLineHandler, RecordWorktreeLibrariesHandler, SendUnfinishedTasksLineHandler, SwitchWorkerSandboxHandler, RecordMergeFollowupHandler, RecordFollowupStepHandler, RecordMergeRequestHandler, QueueWorkerOperationHandler, ClaimWorkerOperationHandler, RunWorkerOperationHandler, EditWorkerRouteHandler, MakeWorkerRouteHandler, DeleteWorkerRouteHandler, MoveWorkerRouteHandler, ReportWorkerRouteFallbackHandler, ReportWorkerProgramRecoveryHandler, RecordWorkerTestRunHandler, NameWorkerTestsHandler, RunWorkerTestHandler, SendMergerInputHandler, SendMergerReportHandler, StartMergerHandler, ReadNextMergeHandler, MergeNextWorkerHandler, ReturnWorkerHandler, SendMergeFindingsHandler, RecordOwnTestFailureHandler, OpenKeptWorktreeHandler, EndInactiveWorkerHandler, AskWorkerTestHandler, AllowWorkerTestHandler, UseWorkerTestHandler, RestoreWorkerTestsHandler, ReadWorkerLogsHandler, QueueStalledTestsHandler, SendSilentAgentLinesHandler, ReportSilentAgentHandler, RecordAffectedTestHandler, EndGoneWorkerHandler, RecordWorkerRefusalHandler, ClearWorkerRefusalsHandler, StartWorkerTestsHandler, RecordWorkerTestHandler, SendWorkerHandler, DispatchWorkerHandler, ReleaseWorkerHandler, MakeProofHandler, DeliverTaskHandler, RecordWorktreeBaseHandler, RecordWorktreeMergeHandler, RecordWorktreeRemovalHandler, RecordWorktreeReleaseHandler, OpenWorkerWorktreeHandler, RecordWorktreeCutHandler, CancelWorkerOpeningHandler, StartNextWorkerTaskHandler, ShortProofHandler, MergeWorkerHandler, RecordTodoListHandler, PrepareWorktreeHandler, RemoveProjectWorktreeHandler, RemoveOrphanWorktreesHandler]
    subcommands = [SendMergerAdviceSubcommand, CheckWorkerFilesSubcommand, RecoverWorkerLibrariesSubcommand, JudgeWorkerTestSubcommand, AskMainAgentSubcommand, AskMergerSubcommand, RunWorkerTestSubcommand, ListInjectionsSubcommand, SwitchWorkerSandboxSubcommand, RunWorkerOperationSubcommand, MakeWorkerRouteSubcommand, EditWorkerRouteSubcommand, DeleteWorkerRouteSubcommand, MoveWorkerRouteSubcommand, WorkerRouteListSubcommand, WorkerSplitSubcommand, ReadNextMergeSubcommand, MergeNextWorkerSubcommand, ReturnWorkerSubcommand, SendMergeFindingsSubcommand, AllowWorkerTestSubcommand, ReadWorkerLogsSubcommand, ShortProofSubcommand, WorkerProgressSubcommand,WorkerWaitsSubcommand, SendWorkerReportSubcommand, WorkerStatusSubcommand, SendWorkerSubcommand, WorkerPointsSubcommand, ProofPointsSubcommand, DispatchWorkerSubcommand, ReleaseWorkerSubcommand, MakeProofSubcommand, EditProofSubcommand, ReviseProofSubcommand, DeliverTaskSubcommand, StartNextWorkerTaskSubcommand, MergeWorkerSubcommand, PrepareWorktreeSubcommand, WorkerModelsSubcommand, ProjectWorktreeListSubcommand, RemoveProjectWorktreeSubcommand]
    guards = [MergerMessageGuard, WorkerRouteGuard, WorkerRouteOwnerGuard, WorkerRouteAccessGuard, WorkerRouteShapeGuard, DispatchBranchGuard, DispatchWorkerGuard, ProofPointGuard, WorkerTaskGuard, MergeProofGuard, BaseBranchGuard, MainDispatchGuard, MainHelperGuard, MainMergeGuard, WorkerHelperGuard]
    driver_rules = [ContextHardStopRule, ContextSizeRule, ContextStopNowRule, CompactionWakeRule, CacheRefreshRule, ProtectedFolderRule, ApprovedPlanStopRule, WorkerTestLineRule, PhaseTestRule, HelperAllowanceRule, WorkerReadRule, WorkerStatusFirstRule, MissingProcessRule, WorkerTestCountRule, WorkerJudgeScopeRule, WorkerReuseRule, WorkerFileRule, WorkerLogDueRule, DeliveredWorkStopRule, DispatchAllowanceRule, MergeCheckoutRule, RecordTodoListRule, WorkersOutRule, InactiveHelperRule, UnstartedWorkerRule, StoppedWorkerRunRule, StoppedWorkerRule, UnmergedWorkerRule, SmallBatchRule, InactiveWorkerStopRule, OrphanWorktreeRule, WorkerReportRule, WorkerOutsideLinkRule]
    marks = WORKER_MARKS
    declared_plugin_events = ["worker_clocking_out", "worker_delivering", "worker_merging"]
    bindings = {ReadCommands: WorkerReadCommands, WorkerRecoveryReports: RecordWorkerRecoveryReports, AgentWork: WorkerAgentWork, AgentBriefPoints: WorkerBriefPoints, AssignedWorkSources: WorkerTaskSources, AgentFolders: WorkerFolders, AgentStops: WorkerAgentStops, AgentLaunchGuard: WorkerSessions, AgentWriteFolder: WorkerWriteFolder, AgentSandboxChoice: WorkerSandboxChoice, AgentCheckouts: WorkerCheckouts, TaskAssignees: WorkerTaskAssignees, SkillProjects: WorkerSkillProjects, TaskWaitTargets: WorkerTaskWaitTargets, QueueRunWorkers: WorkerQueueRunWorkers, RunCounts: WorkerTestListings, PartVisibility: WorkerPartVisibility, RunWaits: WorkerRunWaits}
    listeners = [ContextChangeWakeListener, CompactedWorkerListener, WorkerInstructionTaskListener, WorkerAssignmentMarkListener, WorkerProcessRemovalListener, WorkerOperationListener, WorkerRouteMarkListener, WorkerSplitMarkListener, TaskRouteMarkListener, TaskTagRouteMarkListener, WorkerLogOutputListener, WorkerMergeBlockListener, MergerTestsPassedListener, MergerWakeListener, DeletedWorkerSourceListener, WorkerJobSourceListener, WorktreeRowsListener, SilentWorkerLineListener, WorkerTestCountListener, RemovedWorktreeAgentListener, ReaderSampleReadyListener, WorkerHelpRequestListener, WorkerStoppedMarkListener, WorkerHelpRequestMarkListener, WorkerStopResultListener, MainAgentWorkersListener, BlockedWorkerTaskListener, StartedWorkerTaskListener, OpenedWorkerTaskListener, AssignedWorkerTaskListener, ReassignedTaskListener, DelegatedTaskCommentListener, WorkerCountRaisedListener, WorkerMoveMarkListener, WorkerJobMarkListener, MergerAskMarkListener, WorkerTestRequestMarkListener, WorkerTestListener, WorkerTestRunListener, WorkerTestMarkListener, EndedWorkerListener, WorkerRunEndedListener, BootOrphanWorktreesListener, EndedWorkerJobListener, WorkerJobResumeListener, ReleasedStopListener, WorkerProgramListener, WorkerProofRowsListener, AffectedTestRowsListener, WorkerTaskWaitListener, HelperFolderCommitListener, PublishedFilesCommitListener, MergedWorkerLineListener]
    tick_handlers = [TickHandler(TickInterval(seconds=60), WorkerInstructionRefresh(), "worker instruction files"), TickHandler(TickInterval(seconds=60), StoppedWorkerLibraries(), "stopped worker libraries"), TickHandler(TickInterval(seconds=60), MergerRetry(), "merger retry"), TickHandler(TickInterval(seconds=10), WorkerResumeRetry(), "worker resume retry"), TickHandler(TickInterval(seconds=24 * 60 * 60), GoneWorkerRecovery(), "gone worker recovery at start", starts_immediately=True), TickHandler(TickInterval(seconds=60), StalledWorkerTests(), "stalled worker tests"), TickHandler(TickInterval(seconds=15), UnlaunchedWorkerTests(), "unlaunched worker tests")]
    windows =[WindowDeclaration("workers.points", "Brief points", "points.js", WindowLoading.COMPONENT, skeleton=WORKERS_POINTS_SKELETON, icon=WindowIcon.CHECK, shows=WindowShows.SELECTED_AGENT,
                                 reads=["worker-worktree points", "proof points"], events=["proof.*", "worker_worktree.*"], keys=[WindowKey("points", "worker-worktree points", arguments=["agent"], events=["proof.*", "worker_worktree.*"])]),
               WindowDeclaration("workers.todos", "Tasks", "todos.js", WindowLoading.COMPONENT, skeleton=WORKERS_TODOS_SKELETON, icon=WindowIcon.TASK, shows=WindowShows.SELECTED_AGENT, reads=["todo-item list"],
                                 events=["todo_item.*"], keys=[WindowKey("todos", "todo-item list --oldest", arguments=["agent"], events=["todo_item.*"])]),
               WindowDeclaration("workers.workers", "Workers", "workers.js", WindowLoading.COMPONENT, skeleton=WORKERS_WORKERS_SKELETON, icon=WindowIcon.AGENT, place=WindowPlace.DROPDOWN, reads=["agent list", "agent limits", "chat-mark main", "worker split", "worker-route list", "worker-route show", "task tags", "setting show", "provider-outage list"], runs=["message send", "setting set", "worker-route make", "worker-route edit", "worker-route delete", "worker-route move", "provider-outage make", "provider-outage end", "provider-outage delete"], events=["agent.*", "chat_mark.*", "setting.*", "worker_route.*", "provider_outage.*", "task_tag.*"],
                                 tabs=[WindowTab("workers", "Workers", "agent list --role worker"), WindowTab("split", "Split", "worker split"), WindowTab("recent", "Recent activity", "chat-mark main --type workers.worker")],
                                 keys=[WindowKey("workers", "agent list --role worker", tab="workers", events=["agent.*"]),
                                       WindowKey("recent", "chat-mark main --type workers.worker", tab="recent", events=["chat_mark.*"], arguments=["limit", "before-id", "after-id"], page_size=50),
                                       WindowKey("split", "worker split", tab="split", events=["setting.*", "provider_outage.*", "agent.*", "worker_route.*"], reload_seconds=60),
                                       WindowKey("routes", "worker-route list", tab="split", events=["worker_route.*"]),
                                       WindowKey("tags", "task tags", tab="split", events=["task_tag.*"]),
                                       WindowKey("split-limits", "agent limits", tab="split", events=["setting.*", "agent.*"])]),
               WindowDeclaration("workers.worktrees", "Worktrees", "worktrees.js", WindowLoading.COMPONENT, skeleton=WORKERS_WORKTREES_SKELETON, group="project", icon=WindowIcon.BRANCH, reads=["project-worktree list"],
                                 runs=["project-worktree remove"], keys=[WindowKey("worktrees", "project-worktree list")])]
