from engine.database.statement import Statement
from engine.query.conditions.has_value import HasValue


class EndedAgents:
    """Agents explicitly retired, regardless of their last process."""

    def statement(self) -> Statement:
        return HasValue("retired_at").statement()
