from engine.database.statement import Statement


class EndedAgents:
    """Agents explicitly retired, regardless of their last process."""

    def statement(self) -> Statement:
        return Statement("retired_at IS NOT NULL")
