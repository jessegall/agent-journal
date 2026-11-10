from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class ActiveAgentRows:
    """Matches rows whose column names an agent that has neither ended nor been retired."""

    column: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} IN (SELECT id FROM agents WHERE ended_at IS NULL AND retired_at IS NULL)")
