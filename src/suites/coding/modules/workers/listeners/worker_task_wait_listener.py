from functools import singledispatchmethod

from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_task_wait_targets import WorkerTaskWaitTargets
from core.base.change.changed import Changed
from core.base.change.updated import Updated


class WorkerTaskWaitListener(SaveListener[Updated[Agent] | Changed[Worktree] | Changed[Proof]]):
    """Rechecks blocked tasks when a worker, its worktree or its proof tests change."""

    name = "workers.task-waits"

    def __init__(self, targets: WorkerTaskWaitTargets, queries: Queries) -> None:
        self.targets, self.queries = targets, queries

    def handle(self, event: Updated[Agent] | Changed[Worktree] | Changed[Proof], context: Context) -> None:
        self.changed(event.row, context)

    @singledispatchmethod
    def changed(self, row: Model, context: Context) -> None:
        return None

    @changed.register
    def agent_changed(self, row: Agent, context: Context) -> None:
        self.targets.resolve_waits(row.id, context)

    @changed.register
    def worktree_changed(self, row: Worktree, context: Context) -> None:
        self.targets.resolve_waits(row.agent_id, context)

    @changed.register
    def proof_changed(self, row: Proof, context: Context) -> None:
        worktree = self.queries.query(Worktree).find(row.worktree_id)
        self.targets.resolve_waits(worktree.agent_id, context)
