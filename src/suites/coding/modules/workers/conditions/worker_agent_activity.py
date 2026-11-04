from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity


class WorkerAgentActivity(AgentActivity):
    """Finds workers running unfinished tasks or idle with a worktree ready for another job."""

    def statement(self) -> Statement:
        active = super().statement()
        return Statement(f"({active.sql} OR (role = 'worker' AND EXISTS (SELECT 1 FROM tasks WHERE"
                         " (tasks.delegated_to = agent_listing.id OR tasks.holder_id = agent_listing.id)"
                         " AND tasks.state IN ('open', 'started', 'testing'))))", active.parameters)

    def idle(self) -> Statement:
        idle = super().idle()
        active = self.statement()
        return Statement(f"({idle.sql} OR (NOT {active.sql} AND role = 'worker' AND EXISTS (SELECT 1 FROM worker_worktrees"
                         " WHERE worker_worktrees.agent_id = agent_listing.id AND worker_worktrees.removed_at IS NULL)))", idle.parameters + active.parameters)
