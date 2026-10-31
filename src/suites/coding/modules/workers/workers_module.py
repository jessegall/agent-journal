from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from suites.coding.modules.workers.commands.record_todo_list_handler import RecordTodoListHandler
from suites.coding.modules.workers.migrations.m002_todo_items import TodoItemsTableMigration
from suites.coding.modules.workers.models.todo_item import TodoItem
from suites.coding.modules.workers.rules.record_todo_list_rule import RecordTodoListRule
from suites.coding.modules.workers.rules.inactive_worker_rule import InactiveWorkerRule
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule
from suites.coding.modules.workers.listeners.ended_worker_listener import EndedWorkerListener
from suites.coding.modules.workers.listeners.released_stop_listener import ReleasedStopListener
from suites.coding.modules.workers.listeners.worker_program_listener import WorkerProgramListener
from suites.coding.modules.workers.commands.dispatch_worker_handler import DispatchWorkerHandler
from suites.coding.modules.workers.commands.dispatch_worker_subcommand import DispatchWorkerSubcommand
from suites.coding.modules.workers.commands.merge_worker_handler import MergeWorkerHandler
from suites.coding.modules.workers.commands.merge_worker_subcommand import MergeWorkerSubcommand
from suites.coding.modules.workers.commands.release_worker_handler import ReleaseWorkerHandler
from suites.coding.modules.workers.commands.release_worker_subcommand import ReleaseWorkerSubcommand
from suites.coding.modules.workers.commands.deliver_task_handler import DeliverTaskHandler
from suites.coding.modules.workers.commands.deliver_task_subcommand import DeliverTaskSubcommand
from suites.coding.modules.workers.commands.make_proof_handler import MakeProofHandler
from suites.coding.modules.workers.commands.make_proof_subcommand import MakeProofSubcommand
from suites.coding.modules.workers.commands.short_proof_handler import ShortProofHandler
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
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.commands.short_proof import ShortProof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTINGS

WORKTREE_MOVES = [move.name for move in WorktreeLifecycle.moves()]


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task."""

    name = "journal.suites.coding.workers"
    requires_core = ">=5,<6"
    settings = WORKER_SETTINGS
    dependencies = ["journal.core.agents", "journal.core.tasks", "journal.core.environments", "journal.core.settings", "journal.core.drivers"]
    models = [ModelDeclaration(Worktree, query=WorktreeQuery, excluded_subcommands=["make", "edit", "delete", *WORKTREE_MOVES]),
              ModelDeclaration(Proof, query=ProofQuery, commands=[ShortProof], excluded_subcommands=["make", "edit", "delete", "revise"]),
              ModelDeclaration(TodoItem, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [WorkersTablesMigration, TodoItemsTableMigration]
    handlers = [DispatchWorkerHandler, ReleaseWorkerHandler, MakeProofHandler, DeliverTaskHandler, ShortProofHandler, MergeWorkerHandler, RecordTodoListHandler]
    subcommands = [DispatchWorkerSubcommand, ReleaseWorkerSubcommand, MakeProofSubcommand, DeliverTaskSubcommand, MergeWorkerSubcommand]
    guards = [DispatchBranchGuard, DispatchWorkerGuard, ProofPointGuard, WorkerTaskGuard, MergeProofGuard, BaseBranchGuard]
    driver_rules = [DeliveredWorkStopRule, DispatchAllowanceRule, MergeCheckoutRule, RecordTodoListRule, WorkersOutRule, InactiveWorkerRule]
    listeners = [EndedWorkerListener, ReleasedStopListener, WorkerProgramListener]
    windows = [WindowDeclaration("workers.points", "Points", "points.js", WindowLoading.COMPONENT, place=WindowPlace.AGENT,
                                 reads=["worker-worktree list", "task show", "proof list"], events=["proof.*", "worker_worktree.*"]),
               WindowDeclaration("workers.todos", "To-do list", "todos.js", WindowLoading.COMPONENT, place=WindowPlace.AGENT, reads=["todo-item list"],
                                 events=["todo_item.*"])]
