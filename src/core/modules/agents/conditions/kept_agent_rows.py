from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class KeptAgentRows:
    """Matches rows whose column names an agent that has not been retired, running or ended."""

    column: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} IN (SELECT id FROM agents WHERE retired_at IS NULL)")
