from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity


class WorkerAgentActivity(AgentActivity):
    """Finds workers with a worktree available for another job."""

    def idle(self) -> Statement:
        idle = super().idle()
        active = self.statement()
        return Statement(f"({idle.sql} OR (NOT {active.sql} AND role = 'worker' AND EXISTS (SELECT 1 FROM worker_worktrees"
                         " WHERE worker_worktrees.agent_id = agent_listing.id AND worker_worktrees.removed_at IS NULL)))", idle.parameters + active.parameters)
