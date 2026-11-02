from suites.coding.modules.workers.support.worker_nudges import WORKER_NUDGES
from core.base.viewer.window_icon import WindowIcon
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from suites.coding.modules.workers.commands.record_todo_list.record_todo_list_handler import RecordTodoListHandler
from suites.coding.modules.workers.migrations.m002_todo_items import TodoItemsTableMigration
from suites.coding.modules.workers.models.todo_item import TodoItem
from suites.coding.modules.workers.rules.record_todo_list_rule import RecordTodoListRule
from suites.coding.modules.workers.rules.inactive_worker_rule import InactiveWorkerRule
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule
from suites.coding.modules.workers.rules.worker_log_due_rule import WorkerLogDueRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from suites.coding.modules.workers.commands.send_worker.send_worker_handler import SendWorkerHandler
from suites.coding.modules.workers.commands.send_worker.send_worker_subcommand import SendWorkerSubcommand
from suites.coding.modules.workers.listeners.ended_worker_job_listener import EndedWorkerJobListener
from suites.coding.modules.workers.listeners.ended_worker_listener import EndedWorkerListener
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
from suites.coding.modules.workers.commands.deliver_task.deliver_task_subcommand import DeliverTaskSubcommand
from suites.coding.modules.workers.commands.make_proof.make_proof_handler import MakeProofHandler
from suites.coding.modules.workers.commands.make_proof.make_proof_subcommand import MakeProofSubcommand
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
from suites.coding.modules.workers.commands.worker_points.worker_points_subcommand import WorkerPointsSubcommand
from suites.coding.modules.workers.commands.worker_points.proof_points_subcommand import ProofPointsSubcommand
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.commands.short_proof.short_proof import ShortProof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTINGS
from suites.coding.modules.workers.upgrade.workers_move import WorkersMove

WORKTREE_MOVES = [move.name for move in WorktreeLifecycle.moves()]
from suites.coding.modules.workers.commands.worker_models.worker_models_subcommand import WorkerModelsSubcommand
from suites.coding.modules.workers.rules.worker_test_turn_rule import WorkerTestTurnRule
from suites.coding.modules.workers.commands.project_worktree_list.project_worktree_list_subcommand import ProjectWorktreeListSubcommand
from suites.coding.modules.workers.commands.remove_project_worktree.remove_project_worktree_handler import RemoveProjectWorktreeHandler
from suites.coding.modules.workers.commands.remove_project_worktree.remove_project_worktree_subcommand import RemoveProjectWorktreeSubcommand


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task.
    """

    name = "journal.suites.coding.workers"
    nudges = WORKER_NUDGES
    seed_reason = "a worker needs a git worktree, which a scratch demo has none of"
    requires_core = ">=5,<6"
    settings = WORKER_SETTINGS
    dependencies = ["journal.core.agents", "journal.core.tasks", "journal.core.environments", "journal.core.settings", "journal.core.drivers", "journal.core.plugins", "journal.core.processes"]
    models = [ModelDeclaration(Worktree, query=WorktreeQuery, excluded_subcommands=["make", "edit", "delete", *WORKTREE_MOVES]),
              ModelDeclaration(Proof, query=ProofQuery, commands=[ShortProof], excluded_subcommands=["make", "edit", "delete", "revise"]),
              ModelDeclaration(TodoItem, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [WorkersTablesMigration, TodoItemsTableMigration, ProofsWorktreeIndexMigration]
    views = [WorkerPoints]
    moves = [WorkersMove]
    handlers = [SendWorkerHandler, DispatchWorkerHandler, ReleaseWorkerHandler, MakeProofHandler, DeliverTaskHandler, ShortProofHandler, MergeWorkerHandler, RecordTodoListHandler, PrepareWorktreeHandler, RemoveProjectWorktreeHandler]
    subcommands = [SendWorkerSubcommand, WorkerPointsSubcommand, ProofPointsSubcommand, DispatchWorkerSubcommand, ReleaseWorkerSubcommand, MakeProofSubcommand, DeliverTaskSubcommand, MergeWorkerSubcommand, PrepareWorktreeSubcommand, WorkerModelsSubcommand, ProjectWorktreeListSubcommand, RemoveProjectWorktreeSubcommand]
    guards = [DispatchBranchGuard, DispatchWorkerGuard, ProofPointGuard, WorkerTaskGuard, MergeProofGuard, BaseBranchGuard]
    driver_rules = [WorkerTestTurnRule, WorkerFileRule, WorkerLogDueRule, DeliveredWorkStopRule, DispatchAllowanceRule, MergeCheckoutRule, RecordTodoListRule, WorkersOutRule, InactiveWorkerRule]
    listeners = [EndedWorkerListener, EndedWorkerJobListener, WorkerJobResumeListener, ReleasedStopListener, WorkerProgramListener]
    windows = [WindowDeclaration("workers.points", "Points", "points.js", WindowLoading.COMPONENT, icon=WindowIcon.CHECK, place=WindowPlace.AGENT,
                                 reads=["worker-worktree points", "proof points"], events=["proof.*", "worker_worktree.*"]),
               WindowDeclaration("workers.todos", "Tasks", "todos.js", WindowLoading.COMPONENT, icon=WindowIcon.TASK, place=WindowPlace.AGENT, reads=["todo-item list"],
                                 events=["todo_item.*"]),
               WindowDeclaration("workers.workers", "Workers", "workers.js", WindowLoading.COMPONENT, icon=WindowIcon.WORKER, place=WindowPlace.DROPDOWN, reads=["agent list"], events=["agent.*"]),
               WindowDeclaration("workers.models", "Worker models", "models.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.MENU, reads=["worker models", "setting show"],
                                 runs=["setting set"], events=["setting.*"]),
               WindowDeclaration("workers.worktrees", "Worktrees", "worktrees.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.BRANCH, reads=["project-worktree list"],
                                 runs=["project-worktree remove"])]
