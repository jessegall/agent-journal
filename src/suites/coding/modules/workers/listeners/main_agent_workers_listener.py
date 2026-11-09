from core.base.agent_role import AgentRole
from core.base.listener.save_listener import SaveListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.base.change.created import Created
from core.base.command.context import Context


class MainAgentWorkersListener(SaveListener[Created[Agent]]):
    """A new main session takes over the workers with worktrees still out in its environment."""

    name = "workers.new-main-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, repository: Repository) -> None:
        self.worktrees, self.queries, self.repository = worktrees, queries, repository

    def handle(self, event: Created[Agent], context: Context) -> None:
        agent = event.row
        if agent.role != AgentRole.MAIN:
            return
        worker_ids = [worktree.session_agent_id for worktree in self.worktrees.open_worktrees()]
        for worker in self.queries.query(Agent).find_many(worker_ids):
            self.repository.save_change(worker, worker.changed(parent_id=agent.id), context)
