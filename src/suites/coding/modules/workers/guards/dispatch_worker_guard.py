from engine.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.change.created import Created
from engine.command.context import Context
from suites.coding.modules.workers.models.worktree import Worktree


class DispatchWorkerGuard(Guard[Created[Worktree]]):
    """Refuses a worktree a worker asked for: a worker does its own task and dispatches no workers."""

    name = "workers.worker-runs-no-dispatch"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Created[Worktree], context: Context) -> None:
        if self.queries.query(Agent).filter(id=context.actor.id, role=CodingHelperRole.WORKER).exists():
            raise Refusal("a worker dispatches no workers", 'journal worker report "<what the task needs>"')
