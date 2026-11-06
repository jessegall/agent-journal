from core.base.database.statement import Statement


class AgentActivity:
    """An agent whose process runs and whose session is not retired."""

    def statement(self) -> Statement:
        return Statement("ended_at IS NULL AND retired_at IS NULL")

    def idle(self) -> Statement:
        return Statement("(ended_at IS NOT NULL AND retired_at IS NULL)")
