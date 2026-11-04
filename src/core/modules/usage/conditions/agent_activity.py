from core.base.database.statement import Statement


class AgentActivity:
    """An agent whose session is still open."""

    def statement(self) -> Statement:
        return Statement("ended_at IS NULL")
