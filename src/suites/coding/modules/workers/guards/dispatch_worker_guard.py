from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_role import AgentRole


class DispatchWorkerGuard(Guard):
    """Refuses a worktree a worker asked for: a worker does its own task and dispatches no workers."""

    name = "workers.worker-runs-no-dispatch"
    event = "worker_worktree.create"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        if self.queries.query(Agent).filter(id=change.actor.id, role=AgentRole.WORKER).exists():
            raise Refusal("a worker dispatches no workers", "tell the agent that sent you what the task needs")
