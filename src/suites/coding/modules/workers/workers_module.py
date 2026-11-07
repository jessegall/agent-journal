from suites.coding.modules.workers.rules.approved_plan_stop_rule import ApprovedPlanStopRule
from suites.coding.modules.workers.support.worker_nudges import APPROVED_PLAN_WAIT
from suites.coding.modules.workers.commands.open_kept_worktree.open_kept_worktree_handler import OpenKeptWorktreeHandler
from suites.coding.modules.workers.commands.end_idle_worker.end_idle_worker_handler import EndIdleWorkerHandler
from suites.coding.modules.workers.migrations.m026_worktree_new_agent_reason import WorktreeNewAgentReasonMigration
from suites.coding.modules.workers.migrations.m027_worktree_reason_name import WorktreeReasonNameMigration
from suites.coding.modules.workers.migrations.m028_worker_test_failures import WorkerTestFailuresMigration
from suites.coding.modules.workers.migrations.m024_worker_limit_keys import WorkerLimitKeysMigration
from suites.coding.modules.workers.migrations.m025_settle_old_workers import RetireOldWorkersMigration
from suites.coding.modules.workers.migrations.m019_worker_logs_read import WorkerLogsReadMigration
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs_handler import ReadWorkerLogsHandler
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs_subcommand import ReadWorkerLogsSubcommand
from suites.coding.modules.workers.migrations.m016_worker_session import WorkerSessionMigration
from core.base.agent_checkouts import AgentCheckouts
from core.base.agent_write_folder import AgentWriteFolder
from suites.coding.modules.workers.support.worker_checkouts import WorkerCheckouts
from suites.coding.modules.workers.support.worker_write_folder import WorkerWriteFolder
from suites.coding.support.shipped_profiles import WORKER_PROFILES
from suites.coding.modules.workers.listeners.silent_worker_line_listener import SilentWorkerLineListener
from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines_handler import SendSilentAgentLinesHandler
from suites.coding.modules.workers.commands.report_silent_agent.report_silent_agent_handler import ReportSilentAgentHandler
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
from suites.coding.modules.workers.listeners.worker_help_request_listener import WorkerHelpRequestListener
from suites.coding.modules.workers.listeners.worker_move_mark_listener import WorkerMoveMarkListener
from suites.coding.modules.workers.listeners.worker_job_mark_listener import WorkerJobMarkListener
from suites.coding.modules.workers.listeners.worker_stopped_mark_listener import WorkerStoppedMarkListener
from suites.coding.modules.workers.listeners.worker_help_request_mark_listener import WorkerHelpRequestMarkListener
from suites.coding.modules.workers.listeners.worker_test_mark_listener import WorkerTestMarkListener
from suites.coding.modules.workers.support.worker_marks import WORKER_MARKS
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test_handler import RecordWorkerTestHandler
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests_handler import StartWorkerTestsHandler
from suites.coding.modules.workers.listeners.worker_test_listener import WorkerTestListener
from suites.coding.modules.workers.migrations.m005_proof_tests import ProofTestsMigration
from suites.coding.modules.workers.migrations.m004_proofs_per_task import ProofsPerTaskMigration
from suites.coding.modules.workers.rules.worker_status_first_rule import WorkerStatusFirstRule
from suites.coding.modules.workers.support.worker_nudges import WORKER_NUDGES
from core.base.skill.skill_declaration import SkillDeclaration
from suites.coding.modules.workers.models.worker_progress import WorkerProgress
from suites.coding.modules.workers.commands.worker_progress.worker_progress_subcommand import WorkerProgressSubcommand
from core.modules.tasks.support.task_assignees import TaskAssignees
from suites.coding.modules.workers.support.worker_task_assignees import WorkerTaskAssignees
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.stalled_worker_tests import StalledWorkerTests
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
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
from core.base.access import Access
from core.base.agent_type import AgentType
from suites.coding.modules.workers.support.worker_roster import WorkerRoster
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.part_visibility import PartVisibility
from suites.coding.modules.workers.support.worker_part_visibility import WorkerPartVisibility
from suites.coding.modules.workers.support.worker_test_listings import WorkerTestListings
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
from suites.coding.modules.workers.rules.missing_process_rule import MissingProcessRule
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from suites.coding.modules.workers.bindings.worker_queue_run_workers import WorkerQueueRunWorkers
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_tab import WindowTab
from core.base.viewer.window_extension import WindowExtension
from core.base.viewer.window_source import WindowSource
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_shows import WindowShows
from suites.coding.modules.workers.commands.record_todo_list.record_todo_list_handler import RecordTodoListHandler
from suites.coding.modules.workers.migrations.m002_todo_items import TodoItemsTableMigration
from suites.coding.modules.workers.models.todo_item import TodoItem
from suites.coding.modules.workers.rules.record_todo_list_rule import RecordTodoListRule
from suites.coding.modules.workers.rules.inactive_helper_rule import InactiveHelperRule
from suites.coding.modules.workers.rules.unstarted_worker_rule import UnstartedWorkerRule
from suites.coding.modules.workers.rules.stopped_worker_run_rule import StoppedWorkerRunRule
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule
from suites.coding.modules.workers.rules.small_batch_rule import SmallBatchRule
from suites.coding.modules.workers.rules.idle_worker_stop_rule import IdleWorkerStopRule
from suites.coding.modules.workers.rules.orphan_worktree_rule import OrphanWorktreeRule
from suites.coding.modules.workers.listeners.boot_orphan_worktrees_listener import BootOrphanWorktreesListener
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees_handler import RemoveOrphanWorktreesHandler
from suites.coding.modules.workers.migrations.m015_allowed_models_key import AllowedModelsKeyMigration
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule
from suites.coding.modules.workers.rules.helper_allowance_rule import HelperAllowanceRule
from suites.coding.modules.workers.rules.worker_read_rule import WorkerReadRule
from suites.coding.modules.workers.rules.worker_judge_scope_rule import WorkerJudgeScopeRule
from suites.coding.modules.workers.rules.worker_log_due_rule import WorkerLogDueRule
from suites.coding.modules.workers.rules.worker_reuse_rule import WorkerReuseRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from suites.coding.modules.workers.rules.worker_report_rule import WorkerReportRule
from suites.coding.modules.workers.commands.send_worker.send_worker_handler import SendWorkerHandler
from suites.coding.modules.workers.commands.send_worker.send_worker_subcommand import SendWorkerSubcommand
from suites.coding.modules.workers.listeners.ended_worker_job_listener import EndedWorkerJobListener
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
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings_handler import SendMergeFindingsHandler
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report_handler import SendMergerReportHandler
from suites.coding.modules.workers.commands.start_merger.start_merger_handler import StartMergerHandler
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report_subcommand import SendMergerReportSubcommand
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings_subcommand import SendMergeFindingsSubcommand
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker_subcommand import MergeNextWorkerSubcommand
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge_subcommand import ReadNextMergeSubcommand
from suites.coding.modules.workers.commands.return_worker.return_worker_subcommand import ReturnWorkerSubcommand
from suites.coding.modules.workers.listeners.merger_wake_listener import MergerWakeListener
from suites.coding.modules.workers.migrations.m029_worktree_tests_passed import WorktreeTestsPassedMigration
from suites.coding.modules.workers.migrations.m030_merger_lines import MergerLinesMigration
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_nudges import MERGER_MERGED, MERGER_PASSED
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
from suites.coding.modules.workers.support.skeletons import WORKERS_POINTS_SKELETON, WORKERS_TODOS_SKELETON, WORKERS_WORKERS_SKELETON, WORKERS_MODELS_SKELETON, WORKERS_WORKTREES_SKELETON


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
    agent_types = [AgentType("worker", "Worker", extends="helper", access=Access.WRITING, separate_folder=True,
                             default_profile="journal-worker", start_line="journal worker dispatch", roster=WorkerRoster, run_limit_key=WORKER_RUN_LIMIT, kept_limit_key=WORKER_KEPT_LIMIT, job_command=("worker", "send"), job_task_flag="--task")]
    parent_suite = "coding"
    templates = WORKER_TEMPLATES
    window_extensions = [*(WindowExtension(name, reads=["proof list", "worker waits", "worker progress"], runs=["worker send"],
                                          events=["proof.*", "worker_worktree.*"],
                                          sources=[WindowSource("waits", "worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]),
                                                   WindowSource("progress", "worker progress", ["task.*", "worker_worktree.*"]),
                                                   WindowSource("queue", "proof list --limit 50", ["proof.*"])]) for name in ("agents.agents", "agents.helpers")),
                         WindowExtension("viewer.shell", reads=["worker-worktree points", "worker-worktree list", "proof list"],
                                         runs=["worker send", "worker merge", "worker release"])]
    nudges = [APPROVED_PLAN_WAIT, MERGER_MERGED, MERGER_PASSED, *WORKER_NUDGES, TEST_COUNT_UNKNOWN, TEST_LIMIT_STOP, TEST_LIMIT_REFUSAL]
    seed_reason = "a worker needs a git worktree, which a scratch demo has none of"
    requires_core = ">=5,<6"
    settings = WORKER_SETTINGS
    dependencies = ["journal.suites.coding", "journal.core.agents", "journal.core.tasks", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.plugins", "journal.core.processes", "journal.core.chat", "journal.core.messages", "journal.core.documents", "journal.core.usage", "journal.core.aliases", "journal.core.viewer", "journal.core.mcp", "journal.core.waits", "journal.core.reviews"]
    skills = [SkillDeclaration("journal-workers", "Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one", keywords=("worker", "workers", "worktree"), commands=("worker", "proof"))]
    models = [ModelDeclaration(AffectedTest, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WorkerRefusalCount), ModelDeclaration(MergerLine, excluded_subcommands=["make", "edit", "delete", "show", "list"]), ModelDeclaration(WorkerTestFailure, excluded_subcommands=["make", "edit", "delete", "show", "list"]), ModelDeclaration(Worktree, query=WorktreeQuery, excluded_subcommands=["make", "edit", "delete", *WORKTREE_MOVES]),
              ModelDeclaration(Proof, query=ProofQuery, excluded_subcommands=["make", "edit", "delete", "revise", "queue", "run"]),
              ModelDeclaration(WorkerTestRequest, excluded_subcommands=["make", "edit", "delete", "allow", "use"]),
              ModelDeclaration(TodoItem, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(WorkerTaskSource, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [WorktreeReasonNameMigration, WorkerTestFailuresMigration, WorktreeTestsPassedMigration, MergerLinesMigration, WorktreeNewAgentReasonMigration, RetireOldWorkersMigration, WorkerLimitKeysMigration, WorkerTaskSourcesMigration, WorkerTestRequestsMigration, ProofPhaseTestPointMigration, WorktreeMergeCommitsMigration, WorkerLogsReadMigration, StartsHelpersKeyMigration, WorkerSessionMigration, AllowedModelsKeyMigration, WorkerQueueReadIndexesMigration, WorkerReadIndexesMigration, AffectedTestsMigration, ProcessOwnerMigration, ProofProcessWorkMigration, WorkerRefusalsMigration, WorkersTablesMigration, TodoItemsTableMigration, ProofsWorktreeIndexMigration, ProofsPerTaskMigration, ProofTestsMigration, WorkerTestSettingMigration, ReportVisibilityMigration, AliasAccessMigration, OpenWorktreeIndexMigration]
    views = [WorkerPoints, WorkerWait, WorkerProgress]
    moves = [WorkersMove, AliasPermissionsMove]
    handlers = [SendMergerInputHandler, SendMergerReportHandler, StartMergerHandler, ReadNextMergeHandler, MergeNextWorkerHandler, ReturnWorkerHandler, SendMergeFindingsHandler, RecordOwnTestFailureHandler, OpenKeptWorktreeHandler, EndIdleWorkerHandler, AskWorkerTestHandler, AllowWorkerTestHandler, UseWorkerTestHandler, RestoreWorkerTestsHandler, ReadWorkerLogsHandler, QueueStalledTestsHandler, SendSilentAgentLinesHandler, ReportSilentAgentHandler, RecordAffectedTestHandler, EndGoneWorkerHandler, RecordWorkerRefusalHandler, ClearWorkerRefusalsHandler, StartWorkerTestsHandler, RecordWorkerTestHandler, SendWorkerHandler, DispatchWorkerHandler, ReleaseWorkerHandler, MakeProofHandler, DeliverTaskHandler, RecordWorktreeBaseHandler, RecordWorktreeMergeHandler, RecordWorktreeRemovalHandler, RecordWorktreeReleaseHandler, OpenWorkerWorktreeHandler, RecordWorktreeCutHandler, CancelWorkerOpeningHandler, StartNextWorkerTaskHandler, ShortProofHandler, MergeWorkerHandler, RecordTodoListHandler, PrepareWorktreeHandler, RemoveProjectWorktreeHandler, RemoveOrphanWorktreesHandler]
    subcommands = [SendMergerReportSubcommand, ReadNextMergeSubcommand, MergeNextWorkerSubcommand, ReturnWorkerSubcommand, SendMergeFindingsSubcommand, AllowWorkerTestSubcommand, ReadWorkerLogsSubcommand, ShortProofSubcommand, WorkerProgressSubcommand,WorkerWaitsSubcommand, SendWorkerReportSubcommand, WorkerStatusSubcommand, SendWorkerSubcommand, WorkerPointsSubcommand, ProofPointsSubcommand, DispatchWorkerSubcommand, ReleaseWorkerSubcommand, MakeProofSubcommand, EditProofSubcommand, DeliverTaskSubcommand, StartNextWorkerTaskSubcommand, MergeWorkerSubcommand, PrepareWorktreeSubcommand, WorkerModelsSubcommand, ProjectWorktreeListSubcommand, RemoveProjectWorktreeSubcommand]
    guards = [DispatchBranchGuard, DispatchWorkerGuard, ProofPointGuard, WorkerTaskGuard, MergeProofGuard, BaseBranchGuard]
    driver_rules = [ApprovedPlanStopRule, PhaseTestRule, HelperAllowanceRule, WorkerReadRule, WorkerStatusFirstRule, MissingProcessRule, WorkerTestCountRule, WorkerJudgeScopeRule, WorkerReuseRule, WorkerFileRule, WorkerLogDueRule, DeliveredWorkStopRule, DispatchAllowanceRule, MergeCheckoutRule, RecordTodoListRule, WorkersOutRule, InactiveHelperRule, UnstartedWorkerRule, StoppedWorkerRunRule, UnmergedWorkerRule, SmallBatchRule, IdleWorkerStopRule, OrphanWorktreeRule, WorkerReportRule]
    marks = WORKER_MARKS
    declared_plugin_events = ["worker_clocking_out", "worker_delivering", "worker_merging"]
    bindings = {AssignedWorkSources: WorkerTaskSources, AgentFolders: WorkerFolders, AgentStops: WorkerAgentStops, AgentLaunchGuard: WorkerSessions, AgentWriteFolder: WorkerWriteFolder, AgentCheckouts: WorkerCheckouts, TaskAssignees: WorkerTaskAssignees, SkillProjects: WorkerSkillProjects, TaskWaitTargets: WorkerTaskWaitTargets, QueueRunWorkers: WorkerQueueRunWorkers, RunCounts: WorkerTestListings, PartVisibility: WorkerPartVisibility}
    listeners = [MergerWakeListener, DeletedWorkerSourceListener, WorkerJobSourceListener, WorktreeRowsListener, SilentWorkerLineListener, WorkerTestCountListener, RemovedWorktreeAgentListener, ReaderSampleReadyListener,WorkerHelpRequestListener, WorkerStoppedMarkListener, WorkerHelpRequestMarkListener, WorkerStopResultListener, MainAgentWorkersListener, BlockedWorkerTaskListener, ReassignedTaskListener, DelegatedTaskCommentListener, WorkerCountRaisedListener, WorkerMoveMarkListener, WorkerJobMarkListener, WorkerTestListener, WorkerTestMarkListener, EndedWorkerListener, WorkerRunEndedListener, BootOrphanWorktreesListener, EndedWorkerJobListener, WorkerJobResumeListener, ReleasedStopListener, WorkerProgramListener, WorkerProofRowsListener, AffectedTestRowsListener, WorkerTaskWaitListener]
    tick_handlers = [TickHandler(TickInterval(seconds=10), WorkerResumeRetry(), "worker resume retry"), TickHandler(TickInterval(seconds=60), StalledWorkerTests(), "stalled worker tests")]
    windows =[WindowDeclaration("workers.points", "Points", "points.js", WindowLoading.COMPONENT, skeleton=WORKERS_POINTS_SKELETON, icon=WindowIcon.CHECK, shows=WindowShows.SELECTED_AGENT,
                                 reads=["worker-worktree points", "proof points"], events=["proof.*", "worker_worktree.*"], keys=[WindowKey("points", "worker-worktree points", arguments=["agent"], events=["proof.*", "worker_worktree.*"])]),
               WindowDeclaration("workers.todos", "Tasks", "todos.js", WindowLoading.COMPONENT, skeleton=WORKERS_TODOS_SKELETON, icon=WindowIcon.TASK, shows=WindowShows.SELECTED_AGENT, reads=["todo-item list"],
                                 events=["todo_item.*"], keys=[WindowKey("todos", "todo-item list --oldest", arguments=["agent"], events=["todo_item.*"])]),
               WindowDeclaration("workers.workers", "Workers", "workers.js", WindowLoading.COMPONENT, skeleton=WORKERS_WORKERS_SKELETON, icon=WindowIcon.AGENT, place=WindowPlace.DROPDOWN, reads=["agent list", "chat-mark main"], runs=["message send"], events=["agent.*", "chat_mark.*"],
                                 tabs=[WindowTab("workers", "Workers", "agent list --role worker"), WindowTab("recent", "Recent activity", "chat-mark main --type workers.worker")],
                                 keys=[WindowKey("workers", "agent list --role worker", tab="workers", events=["agent.*"]),
                                       WindowKey("recent", "chat-mark main --type workers.worker", tab="recent", events=["chat_mark.*"], arguments=["limit", "before-id", "after-id"], page_size=50)]),
               WindowDeclaration("workers.models", "Worker models", "models.js", WindowLoading.COMPONENT, skeleton=WORKERS_MODELS_SKELETON, group="project", icon=WindowIcon.MENU, reads=["worker models", "setting show"],
                                 runs=["setting set"], events=["setting.*"], keys=[WindowKey("models", "worker models", events=["setting.*"])]),
               WindowDeclaration("workers.worktrees", "Worktrees", "worktrees.js", WindowLoading.COMPONENT, skeleton=WORKERS_WORKTREES_SKELETON, group="project", icon=WindowIcon.BRANCH, reads=["project-worktree list"],
                                 runs=["project-worktree remove"], keys=[WindowKey("worktrees", "project-worktree list")])]
