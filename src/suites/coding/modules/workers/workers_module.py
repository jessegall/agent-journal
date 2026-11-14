from suites.coding.modules.workers.support.workers_module_nudges import WORKERS_MODULE_NUDGES
from suites.coding.modules.workers.models.workers_models import WORKERS_MODELS
from suites.coding.modules.workers.migrations.workers_migrations import WORKERS_MIGRATIONS
from suites.coding.modules.workers.upgrade.workers_moves import WORKERS_MOVES
from suites.coding.modules.workers.commands.workers_handlers import WORKERS_HANDLERS
from suites.coding.modules.workers.commands.workers_subcommands import WORKERS_SUBCOMMANDS
from suites.coding.modules.workers.guards.workers_guards import WORKERS_GUARDS
from suites.coding.modules.workers.rules.workers_driver_rules import WORKERS_DRIVER_RULES
from suites.coding.modules.workers.listeners.workers_listeners import WORKERS_LISTENERS
from suites.coding.modules.workers.windows.extensions.workers_window_extensions import WORKERS_WINDOW_EXTENSIONS
from suites.coding.modules.workers.skills.declarations.workers_skills import WORKERS_SKILLS
from suites.coding.modules.workers.windows.workers_windows import WORKERS_WINDOWS
from suites.coding.modules.workers.states.worker_log_due import WorkerLogDue
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
from suites.coding.modules.workers.support.worker_marks import WORKER_MARKS
from suites.coding.modules.workers.models.worker_progress import WorkerProgress
from core.modules.tasks.support.task_assignees import TaskAssignees
from core.modules.documents.support.document_filers import DocumentFilers
from suites.coding.modules.workers.support.report_document_filers import ReportDocumentFilers
from suites.coding.modules.workers.support.worker_task_assignees import WorkerTaskAssignees
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.ticks.worker_tests.stalled_worker_test_runs import StalledWorkerTestRuns
from suites.coding.modules.workers.ticks.stopped_worker_libraries import StoppedWorkerLibraries
from suites.coding.modules.workers.ticks.worker_instruction_refresh import WorkerInstructionRefresh
from suites.coding.modules.workers.ticks.worker_tests.unlaunched_worker_test_runs import UnlaunchedWorkerTestRuns
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from suites.coding.modules.workers.ticks.behind_worktrees import BehindWorktrees
from suites.coding.modules.workers.ticks.behind_check_pruning import BehindCheckPruning
from suites.coding.modules.workers.ticks.inactive_main_agent_prompt import InactiveMainAgentPrompt
from suites.coding.modules.workers.ticks.ask_watch import AskWatch
from core.modules.messages.support.assigned_work_sources import AssignedWorkSources
from suites.coding.modules.workers.bindings.worker_task_sources import WorkerTaskSources
from engine.module.module import Module
from engine.viewer.button_condition import ButtonCondition
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.text_field import TextField
from suites.coding.modules.workers.types.merger import Merger
from suites.coding.modules.workers.types.worker import Worker
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.part_visibility import PartVisibility
from suites.coding.modules.workers.support.worker_part_visibility import WorkerPartVisibility
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from suites.coding.modules.workers.bindings.worker_run_waits import WorkerRunWaits
from core.modules.processes.support.run_waits import RunWaits
from suites.coding.modules.workers.ticks.gone_worker_recovery import GoneWorkerRecovery
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from suites.coding.modules.workers.bindings.worker_queue_run_workers import WorkerQueueRunWorkers
from suites.coding.modules.workers.bindings.route_rule_warnings import RouteRuleWarnings
from core.modules.assign_rules.support.rules.rule_warnings import RuleWarnings
from suites.coding.modules.workers.ticks.stopped_worker_runs import StoppedWorkerRuns
from suites.coding.modules.workers.ticks.worker_tests.unstarted_worker_proofs import UnstartedWorkerProofs
from suites.coding.modules.workers.ticks.worker_tests.stalled_worker_test_runs import STALLED_TESTS_TICK
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


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task.
    """

    name = "journal.suites.coding.workers"
    profiles = WORKER_PROFILES
    helper_types = [Worker, Merger]
    agent_states = [WorkerLogDue]
    templates = WORKER_TEMPLATES
    window_extensions = WORKERS_WINDOW_EXTENSIONS
    nudges = WORKERS_MODULE_NUDGES
    seed_reason = "a worker needs a git worktree, which a scratch demo has none of"
    requires_engine = ">=5,<6"
    settings = WORKER_SETTINGS
    dependencies = ["journal.suites.coding", "journal.core.agents", "journal.core.asks", "journal.core.tasks", "journal.core.assignments", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.plugins", "journal.core.processes", "journal.core.chat", "journal.core.messages", "journal.core.documents", "journal.core.usage", "journal.core.aliases", "journal.core.viewer", "journal.core.mcp", "journal.core.waits", "journal.core.reviews", "journal.core.profiles", "journal.core.tools", "journal.core.helpers", "journal.core.plans", "journal.core.actors", "journal.core.skills", "journal.core.assign_rules"]
    buttons = [ButtonDeclaration("workers.send-job", tuple(["row.agent"]), "Send the worker a job", "worker send row:{row_id} --job={job}", icon="send", condition=ButtonCondition("working_role", tuple(["worker"])),
                                 fields=tuple([TextField("job", "What should it do?")])),
               ButtonDeclaration("workers.merge", tuple(["row.agent"]), "Merge the work of the worker", "worker merge row:{row_id}", icon="branch", primary=True, condition=ButtonCondition("working_role", tuple(["worker"])),
                                 confirm="Merge its work? Each point needs a checked proof."),
               ButtonDeclaration("workers.release", tuple(["row.agent"]), "Release the worker from its task", "worker release row:{row_id} --reason={reason}", icon="restore", condition=ButtonCondition("working_role", tuple(["worker"])),
                                 fields=tuple([TextField("reason", "Why is it taken off its task?")]))]
    skills = WORKERS_SKILLS
    models = WORKERS_MODELS
    migrations = WORKERS_MIGRATIONS
    views = [WorkerWorkReview, WorkerPoints, WorkerWait, WorkerProgress]
    moves = WORKERS_MOVES
    handlers = WORKERS_HANDLERS
    subcommands = WORKERS_SUBCOMMANDS
    guards = WORKERS_GUARDS
    driver_rules = WORKERS_DRIVER_RULES
    marks = WORKER_MARKS
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
    listeners = WORKERS_LISTENERS
    tick_handlers = [TickHandler(TickInterval(seconds=60), WorkerInstructionRefresh(), "worker instruction files"), TickHandler(TickInterval(seconds=60), StoppedWorkerLibraries(), "stopped worker libraries"), TickHandler(TickInterval(seconds=60), MergerRetry(), "merger retry"), TickHandler(TickInterval(seconds=60), InactiveMainAgentPrompt(), "idle main agent wake"), TickHandler(TickInterval(seconds=60), BehindWorktrees(), "behind worktrees"), TickHandler(TickInterval(seconds=3600), BehindCheckPruning(), "behind check pruning"), TickHandler(TickInterval(seconds=60), AskWatch(), "worker question watch"), TickHandler(TickInterval(seconds=60), StoppedWorkerRuns(), "stopped worker runs"), TickHandler(TickInterval(seconds=10), WorkerResumeRetry(), "worker resume retry"), TickHandler(TickInterval(seconds=24 * 60 * 60), GoneWorkerRecovery(), "gone worker recovery at start", starts_immediately=True), TickHandler(TickInterval(seconds=60), StalledWorkerTestRuns(), STALLED_TESTS_TICK), TickHandler(TickInterval(seconds=60), UnstartedWorkerProofs(), "unstarted worker proofs"), TickHandler(TickInterval(seconds=15), UnlaunchedWorkerTestRuns(), "unlaunched worker tests")]
    windows = WORKERS_WINDOWS
