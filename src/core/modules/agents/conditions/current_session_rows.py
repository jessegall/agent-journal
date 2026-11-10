from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class CurrentSessionRows:
    """Matches rows whose time column is later than the start of an agent's current session. An agent whose
    current session has no start yet matches every row."""

    column: str
    session_agent_id: int

    def statement(self) -> Statement:
        return Statement(f"{self.column} > coalesce((SELECT started_at FROM agent_sessions WHERE session_agent_id = ? ORDER BY id DESC LIMIT 1), '')", [self.session_agent_id])
