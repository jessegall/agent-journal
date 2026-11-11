from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.agent_session import AgentSession
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.event.created import Created
from engine.command.context import Context


class MainAgentWorkersListener(SaveListener[Created[AgentSession]]):
    """A new main session takes over the workers with worktrees still out in its environment, whether it starts
    on a new row or on the main agent's own row, so no line about a worker goes to a main session that ended."""

    name = "workers.new-main-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, repository: Repository) -> None:
        self.worktrees, self.queries, self.repository = worktrees, queries, repository

    def handle(self, event: Created[AgentSession], context: Context) -> None:
        agent = self.queries.query(Agent).find(event.row.session_agent_id)
        if not agent.is_main:
            return
        worker_ids = [worktree.session_agent_id for worktree in self.worktrees.open_worktrees()]
        for worker in self.queries.query(Agent).find_many(worker_ids):
            if worker.parent_id != agent.id:
                self.repository.save_change(worker, worker.changed(parent_id=agent.id), context)
