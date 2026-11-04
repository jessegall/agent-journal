from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity


class WorkerAgentActivity(AgentActivity):
    """Includes workers with unfinished tasks or an active worktree among the running agents."""

    def statement(self) -> Statement:
        active = super().statement()
        return Statement(f"({active.sql} OR (role = 'worker' AND (EXISTS (SELECT 1 FROM tasks WHERE"
                         " (tasks.delegated_to = agent_listing.id OR tasks.holder_id = agent_listing.id)"
                         " AND tasks.state IN ('open', 'started', 'testing')) OR EXISTS (SELECT 1 FROM worker_worktrees"
                         " WHERE worker_worktrees.agent_id = agent_listing.id AND worker_worktrees.removed_at IS NULL))))", active.parameters)
