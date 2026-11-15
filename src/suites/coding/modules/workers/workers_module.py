from suites.coding.modules.workers.lines.context.compaction_request_lines import CompactionRequestLines
from suites.coding.modules.workers.effects.unmerged_worker_effect import UnmergedWorkerEffect
from suites.coding.modules.workers.lines.phase_test_lines import PhaseTestLines
from suites.coding.modules.workers.support.block_conditions.delivered_proofs_checked import DeliveredProofsChecked
from suites.coding.modules.workers.policies.dispatch.dispatch_names_model_policy import DispatchNamesModelPolicy
from suites.coding.modules.workers.effects.orphan_worktree_effect import OrphanWorktreeEffect
from suites.coding.modules.workers.effects.missing_process_effect import MissingProcessEffect
from suites.coding.modules.workers.lines.inactive_worker_stop_lines import InactiveWorkerStopLines
from suites.coding.modules.workers.effects.inactive_worker_stop_effect import InactiveWorkerStopEffect
from suites.coding.modules.workers.lines.context.cache_refresh_lines import CacheRefreshLines
from suites.coding.modules.workers.effects.cache_refresh_effect import CacheRefreshEffect
from suites.coding.modules.workers.effects.merge_job_report_effect import MergeJobReportEffect
from suites.coding.modules.workers.needs.merge_job_needs import MergeJobNeeds
from suites.coding.modules.workers.listeners.worktree_step_listener import WorktreeStepListener
from suites.coding.modules.workers.listeners.proof_step_listener import ProofStepListener
from suites.coding.modules.workers.guards.proved_delivery_guard import ProvedDeliveryGuard
from suites.coding.modules.workers.policies.proved_delivery_policy import ProvedDeliveryPolicy
from suites.coding.modules.workers.effects.context.request_compaction_effect import RequestCompactionEffect
from suites.coding.modules.workers.policies.context_hard_limit_policy import ContextHardLimitPolicy
from suites.coding.modules.workers.needs.compaction_needs import CompactionNeeds
from suites.coding.modules.workers.policies.checkout_write_code_policy import CheckoutWriteCodePolicy
from suites.coding.modules.workers.policies.dispatch.dispatch_allowance_policy import DispatchAllowancePolicy
from suites.coding.modules.workers.policies.test_runs.phase_test_policy import PhaseTestPolicy
from suites.coding.modules.workers.policies.protected_folder_policy import ProtectedFolderPolicy
from suites.coding.modules.workers.policies.readonly_helper_allowance_policy import ReadonlyHelperAllowancePolicy
from suites.coding.modules.workers.policies.worker_file_policy import WorkerFilePolicy
from suites.coding.modules.workers.policies.worker_outside_link_policy import WorkerOutsideLinkPolicy
from suites.coding.modules.workers.policies.worker_read_policy import WorkerReadPolicy
from suites.coding.modules.workers.policies.dispatch.worker_reuse_policy import WorkerReusePolicy
from suites.coding.modules.workers.policies.test_runs.worker_test_count_policy import WorkerTestCountPolicy
from suites.coding.modules.workers.policies.test_runs.worker_test_line_policy import WorkerTestLinePolicy
from suites.coding.modules.workers.lines.context.context_stop_now_lines import ContextStopNowLines
from suites.coding.modules.workers.lines.inactive_helper_lines import InactiveHelperLines
from suites.coding.modules.workers.lines.merge_checkout_lines import MergeCheckoutLines
from suites.coding.modules.workers.lines.small_batch_lines import SmallBatchLines
from suites.coding.modules.workers.lines.stopped_worker_lines import StoppedWorkerLines
from suites.coding.modules.workers.lines.unmerged_worker_lines import UnmergedWorkerLines
from suites.coding.modules.workers.lines.unstarted_worker_lines import UnstartedWorkerLines
from suites.coding.modules.workers.lines.worker_log_due_lines import WorkerLogDueLines
from suites.coding.modules.workers.lines.workers_out_lines import WorkersOutLines
from suites.coding.modules.workers.needs.delivered_work_stop_needs import DeliveredWorkStopNeeds
from suites.coding.modules.workers.needs.worker_status_first_needs import WorkerStatusFirstNeeds
from suites.coding.modules.workers.effects.inactive_helper_effect import InactiveHelperEffect
from suites.coding.modules.workers.effects.phase_test_effect import PhaseTestEffect
from suites.coding.modules.workers.effects.record_todo_list_effect import RecordTodoListEffect
from suites.coding.modules.workers.support.workers_module_nudges import WORKERS_MODULE_NUDGES
from suites.coding.modules.workers.models.workers_models import WORKERS_MODELS
from suites.coding.modules.workers.migrations.workers_migrations import WORKERS_MIGRATIONS
from suites.coding.modules.workers.upgrade.workers_moves import WORKERS_MOVES
from suites.coding.modules.workers.commands.workers_handlers import WORKERS_HANDLERS
from suites.coding.modules.workers.commands.workers_subcommands import WORKERS_SUBCOMMANDS
from suites.coding.modules.workers.guards.workers_guards import WORKERS_GUARDS
from suites.coding.modules.workers.listeners.workers_listeners import WORKERS_LISTENERS
from suites.coding.modules.workers.windows.extensions.workers_window_extensions import WORKERS_WINDOW_EXTENSIONS
from suites.coding.modules.workers.skills.declarations.workers_skills import WORKERS_SKILLS
from suites.coding.modules.workers.windows.workers_windows import WORKERS_WINDOWS
from core.modules.drivers.support.compaction_stop import CompactionStop
from suites.coding.modules.workers.bindings.worker_compaction_stop import WorkerCompactionStop
from suites.coding.support.managed_files import ManagedFiles
from suites.coding.modules.workers.support.journal_managed_files import JournalManagedFiles
from suites.coding.modules.workers.bindings.record_worker_recovery_reports import RecordWorkerRecoveryReports
from suites.coding.modules.workers.support.worker_recovery_reports import WorkerRecoveryReports
from core.modules.processes.support.read_commands import ReadCommands
from suites.coding.modules.workers.support.worker_read_commands import WorkerReadCommands
from core.modules.helpers.support.helper_grant_policy import HelperGrantPolicy
from suites.coding.modules.workers.support.worker_grant_policy import WorkerGrantPolicy
from engine.agent.work.agent_work import AgentWork
from suites.coding.modules.workers.bindings.worker_agent_work import WorkerAgentWork
from suites.coding.modules.workers.bindings.worker_compaction_limit import WorkerCompactionLimit
from core.modules.drivers.support.compaction_limit import CompactionLimit
from suites.coding.modules.workers.support.worker_brief_points import WorkerBriefPoints
from engine.agent.work.agent_brief_points import AgentBriefPoints
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview
from engine.agent.agent_checkouts import AgentCheckouts
from engine.agent.agent_write_folder import AgentWriteFolder
from suites.coding.modules.workers.support.worker_checkouts import WorkerCheckouts
from suites.coding.modules.workers.support.worker_write_folder import WorkerWriteFolder
from engine.sandbox.agent_sandbox_choice import AgentSandboxChoice
from suites.coding.modules.workers.support.worker_sandbox_choice import WorkerSandboxChoice
from suites.coding.support.shipped_profiles import WORKER_PROFILES
from suites.coding.modules.workers.marks.worker_split_mark import WorkerSplitMark
from suites.coding.modules.workers.marks.worker_tests_mark import WorkerTestsMark
from suites.coding.modules.workers.marks.worker_mark import WorkerMark
from suites.coding.modules.workers.models.worker_progress import WorkerProgress
from core.modules.tasks.support.task_assignees import TaskAssignees
from core.modules.documents.support.document_filers import DocumentFilers
from suites.coding.modules.workers.support.report_document_filers import ReportDocumentFilers
from suites.coding.modules.workers.support.worker_task_assignees import WorkerTaskAssignees
from core.modules.messages.support.assigned_work_sources import AssignedWorkSources
from suites.coding.modules.workers.bindings.worker_task_sources import WorkerTaskSources
from engine.module.module import Module
from suites.coding.modules.workers.types.merger import Merger
from suites.coding.modules.workers.types.worker import Worker
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.part_visibility import PartVisibility
from suites.coding.modules.workers.support.worker_part_visibility import WorkerPartVisibility
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from suites.coding.modules.workers.bindings.worker_run_waits import WorkerRunWaits
from core.modules.processes.support.run_waits import RunWaits
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from suites.coding.modules.workers.bindings.worker_queue_run_workers import WorkerQueueRunWorkers
from suites.coding.modules.workers.bindings.route_rule_warnings import RouteRuleWarnings
from core.modules.assign_rules.support.rules.rule_warnings import RuleWarnings
from suites.coding.modules.workers.models.worker_points import WorkerPoints
from suites.coding.modules.workers.models.worker_wait import WorkerWait
from core.modules.plans.support.checkpoint_branch_moves import CheckpointBranchMoves
from suites.coding.modules.workers.support.worker_checkpoint_branch_moves import WorkerCheckpointBranchMoves
from core.modules.plans.support.checkpoint_runs import CheckpointRuns
from suites.coding.modules.workers.support.checkpoint_runner import CheckpointRunner
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from suites.coding.modules.workers.support.worker_policy import WorkerPolicy
from suites.coding.modules.workers.support.worker_folders import WorkerFolders
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTINGS



from core.modules.skills.support.skill_projects import SkillProjects
from suites.coding.modules.workers.support.worker_skill_projects import WorkerSkillProjects
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets
from suites.coding.modules.workers.support.worker_task_wait_targets import WorkerTaskWaitTargets
from suites.coding.modules.workers.support.worker_templates import WORKER_TEMPLATES
from suites.coding.modules.workers.tick_handlers.worker_instruction_refresh_tick_handler import WorkerInstructionRefreshTickHandler
from suites.coding.modules.workers.tick_handlers.stopped_worker_libraries_tick_handler import StoppedWorkerLibrariesTickHandler
from suites.coding.modules.workers.tick_handlers.merger_retry_tick_handler import MergerRetryTickHandler
from suites.coding.modules.workers.tick_handlers.inactive_main_agent_prompt_tick_handler import InactiveMainAgentPromptTickHandler
from suites.coding.modules.workers.tick_handlers.behind_worktrees_tick_handler import BehindWorktreesTickHandler
from suites.coding.modules.workers.tick_handlers.behind_check_pruning_tick_handler import BehindCheckPruningTickHandler
from suites.coding.modules.workers.tick_handlers.ask_watch_tick_handler import AskWatchTickHandler
from suites.coding.modules.workers.tick_handlers.stopped_worker_runs_tick_handler import StoppedWorkerRunsTickHandler
from suites.coding.modules.workers.tick_handlers.worker_resume_retry_tick_handler import WorkerResumeRetryTickHandler
from suites.coding.modules.workers.tick_handlers.gone_worker_recovery_tick_handler import GoneWorkerRecoveryTickHandler
from suites.coding.modules.workers.tick_handlers.stalled_worker_test_runs_tick_handler import StalledWorkerTestRunsTickHandler
from suites.coding.modules.workers.tick_handlers.unstarted_worker_proofs_tick_handler import UnstartedWorkerProofsTickHandler
from suites.coding.modules.workers.tick_handlers.unlaunched_worker_test_runs_tick_handler import UnlaunchedWorkerTestRunsTickHandler
from suites.coding.modules.workers.buttons.workers_send_job_button import WorkersSendJobButton
from suites.coding.modules.workers.buttons.workers_merge_button import WorkersMergeButton
from suites.coding.modules.workers.buttons.workers_release_button import WorkersReleaseButton
from suites.coding.modules.workers.policies.worker_git_policy import WorkerGitPolicy
from suites.coding.modules.workers.policies.worker_judge_scope_policy import WorkerJudgeScopePolicy
from suites.coding.modules.workers.effects.context.full_context_compaction_effect import FullContextCompactionEffect
from suites.coding.modules.workers.needs.main_stop_needs import MainStopNeeds
from suites.coding.modules.workers.effects.handed_task_effect import HandedTaskEffect
from suites.coding.modules.workers.needs.worker_unit_needs import WorkerUnitNeeds
from suites.coding.modules.workers.effects.worker_report_effect import WorkerReportEffect
from suites.coding.modules.workers.lines.worker_blocked_task_lines import WorkerBlockedTaskLines


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task.
    """

    name = "journal.suites.coding.workers"
    line_sources = [InactiveWorkerStopLines, CacheRefreshLines]
    effects = [HandedTaskEffect, FullContextCompactionEffect, WorkerReportEffect, OrphanWorktreeEffect, MissingProcessEffect, InactiveWorkerStopEffect, CacheRefreshEffect, MergeJobReportEffect, RequestCompactionEffect, InactiveHelperEffect, PhaseTestEffect, RecordTodoListEffect, UnmergedWorkerEffect]
    block_conditions = [DeliveredProofsChecked]
    needs = [MainStopNeeds, WorkerUnitNeeds, MergeJobNeeds, CompactionNeeds, DeliveredWorkStopNeeds, WorkerStatusFirstNeeds]
    lines = [WorkerBlockedTaskLines, CompactionRequestLines, ContextStopNowLines, InactiveHelperLines, MergeCheckoutLines, PhaseTestLines, SmallBatchLines, StoppedWorkerLines, UnmergedWorkerLines, UnstartedWorkerLines, WorkerLogDueLines, WorkersOutLines]
    policies = [WorkerGitPolicy, WorkerJudgeScopePolicy, DispatchNamesModelPolicy, ProvedDeliveryPolicy, ContextHardLimitPolicy, CheckoutWriteCodePolicy, DispatchAllowancePolicy, PhaseTestPolicy, ProtectedFolderPolicy, ReadonlyHelperAllowancePolicy, WorkerFilePolicy, WorkerOutsideLinkPolicy, WorkerReadPolicy, WorkerReusePolicy, WorkerTestLinePolicy, WorkerTestCountPolicy]
    profiles = WORKER_PROFILES
    helper_types = [Worker, Merger]
    templates = WORKER_TEMPLATES
    window_extensions = WORKERS_WINDOW_EXTENSIONS
    nudges = WORKERS_MODULE_NUDGES
    seed_reason = "a worker needs a git worktree, which a scratch demo has none of"
    requires_engine = ">=5,<6"
    settings = WORKER_SETTINGS
    dependencies = ["journal.suites.coding", "journal.core.agents", "journal.core.asks", "journal.core.tasks", "journal.core.assignments", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.plugins", "journal.core.processes", "journal.core.chat", "journal.core.messages", "journal.core.documents", "journal.core.usage", "journal.core.aliases", "journal.core.viewer", "journal.core.mcp", "journal.core.waits", "journal.core.reviews", "journal.core.profiles", "journal.core.tools", "journal.core.helpers", "journal.core.plans", "journal.core.actors", "journal.core.skills", "journal.core.assign_rules"]
    buttons = [WorkersSendJobButton,
               WorkersMergeButton,
               WorkersReleaseButton]
    skills = WORKERS_SKILLS
    models = WORKERS_MODELS
    migrations = WORKERS_MIGRATIONS
    views = [WorkerWorkReview, WorkerPoints, WorkerWait, WorkerProgress]
    moves = WORKERS_MOVES
    handlers = WORKERS_HANDLERS
    subcommands = WORKERS_SUBCOMMANDS
    guards = [ProvedDeliveryGuard, *WORKERS_GUARDS]
    marks = [WorkerSplitMark, WorkerTestsMark, WorkerMark]
    declared_plugin_events = ["worker_clocking_out", "worker_delivering", "worker_merging"]
    former_event_keys = {
        "suites.coding.workers.worker_test_request.allow": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_test_request.created": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_test_request.deleted": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_test_request.refuse": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_test_request.restore": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_test_request.updated": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_test_request.use": "core.helpers.helper_grant.created",
        "suites.coding.workers.worker_merge_ask.send_back": "suites.coding.workers.worker_merge_ask.reject",
        "suites.coding.workers.worker_worktree.take_over_cut": "suites.coding.workers.worker_worktree.transfer_cut",
        "suites.coding.workers.worker_worktree.take_over_delivered": "suites.coding.workers.worker_worktree.transfer_delivered",
        "suites.coding.workers.worktree_behind_check.pass_on": "suites.coding.workers.worktree_behind_check.escalate",
        "suites.coding.workers.worktree_behind_check.bring_up_to_date": "suites.coding.workers.worktree_behind_check.mark_updated",
        "suites.coding.workers.worktree_behind_check.hold": "suites.coding.workers.worktree_behind_check.pause",
    }
    bindings = {DocumentFilers: ReportDocumentFilers, CheckpointBranchMoves: WorkerCheckpointBranchMoves, CheckpointRuns: CheckpointRunner, CompactionLimit: WorkerCompactionLimit, CompactionStop: WorkerCompactionStop, ManagedFiles: JournalManagedFiles, HelperGrantPolicy: WorkerGrantPolicy, ReadCommands: WorkerReadCommands, WorkerRecoveryReports: RecordWorkerRecoveryReports, AgentWork: WorkerAgentWork, AgentBriefPoints: WorkerBriefPoints, AssignedWorkSources: WorkerTaskSources, AgentFolders: WorkerFolders, DispatchPolicy: WorkerPolicy, AgentWriteFolder: WorkerWriteFolder, AgentSandboxChoice: WorkerSandboxChoice, AgentCheckouts: WorkerCheckouts, TaskAssignees: WorkerTaskAssignees, SkillProjects: WorkerSkillProjects, TaskWaitTargets: WorkerTaskWaitTargets, QueueRunWorkers: WorkerQueueRunWorkers, RunCounts: WorkerTestListings, PartVisibility: WorkerPartVisibility, RunWaits: WorkerRunWaits, RuleWarnings: RouteRuleWarnings}
    listeners = [*WORKERS_LISTENERS]
    agent_listeners = [WorktreeStepListener, ProofStepListener]
    tick_handlers = [WorkerInstructionRefreshTickHandler, StoppedWorkerLibrariesTickHandler, MergerRetryTickHandler, InactiveMainAgentPromptTickHandler, BehindWorktreesTickHandler, BehindCheckPruningTickHandler, AskWatchTickHandler, StoppedWorkerRunsTickHandler, WorkerResumeRetryTickHandler, GoneWorkerRecoveryTickHandler, StalledWorkerTestRunsTickHandler, UnstartedWorkerProofsTickHandler, UnlaunchedWorkerTestRunsTickHandler]
    windows = WORKERS_WINDOWS
