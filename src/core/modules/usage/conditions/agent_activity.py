from core.base.database.statement import Statement


class AgentActivity:
    """An agent whose session or assigned work is still running."""

    def statement(self) -> Statement:
        return Statement("(ended_at IS NULL OR (role = 'worker' AND EXISTS (SELECT 1 FROM tasks WHERE"
                         " (tasks.delegated_to = agent_listing.id OR tasks.holder_id = agent_listing.id)"
                         " AND tasks.state IN ('open', 'started', 'testing'))))")
