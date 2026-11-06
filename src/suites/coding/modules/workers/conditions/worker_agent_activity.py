from core.base.database.statement import Statement
from core.modules.usage.conditions.agent_activity import AgentActivity
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES


class WorkerAgentActivity(AgentActivity):
    """Finds workers running unfinished tasks or idle with a worktree ready for another job. An ended worker with no
    worktree left is neither, whatever tasks are still assigned to it, and one whose job waits to start is not
    running."""

    def statement(self) -> Statement:
        active = super().statement()
        placeholders = ", ".join("?" for _ in RESUMING_SOURCES)
        return Statement(f"({active.sql} OR (role = 'worker' AND EXISTS (SELECT 1 FROM tasks WHERE"
                         " (tasks.delegated_to = agent_listing.id OR tasks.holder_id = agent_listing.id)"
                         " AND tasks.state IN ('open', 'started', 'testing'))"
                         " AND (ended_at IS NULL OR EXISTS (SELECT 1 FROM worker_worktrees"
                         " WHERE worker_worktrees.session_agent_id = agent_listing.id AND worker_worktrees.removed_at IS NULL)"
                         " AND NOT EXISTS (SELECT 1 FROM agent_lines WHERE agent_lines.session_agent_id = agent_listing.id"
                         f" AND agent_lines.state = 'waiting' AND agent_lines.source IN ({placeholders})))))", (*active.parameters, *RESUMING_SOURCES))

    def idle(self) -> Statement:
        idle = super().idle()
        active = self.statement()
        return Statement(f"({idle.sql} OR (NOT {active.sql} AND role = 'worker' AND EXISTS (SELECT 1 FROM worker_worktrees"
                         " WHERE worker_worktrees.session_agent_id = agent_listing.id AND worker_worktrees.removed_at IS NULL)))", idle.parameters + active.parameters)
