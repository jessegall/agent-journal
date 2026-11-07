from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.row_owner import RowOwner


@dataclass(frozen=True)
class SessionRows:
    """Matches the rows of an agent's own session or, for a main agent, of every main session of its environment;
    a column that may stay empty also matches the rows of no session."""

    owner: RowOwner
    is_nullable: bool

    def statement(self) -> Statement:
        statement = self.main_sessions() if self.owner.is_main else Statement("session_agent_id = ?", [self.owner.agent])
        return Statement(f"(session_agent_id IS NULL OR {statement.sql})", statement.parameters) if self.is_nullable else statement

    def main_sessions(self) -> Statement:
        return Statement("session_agent_id IN (SELECT id FROM agents WHERE role = 'main' AND environment_id = ?)", [self.owner.environment_id])
