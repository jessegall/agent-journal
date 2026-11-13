from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.below_newest import BelowNewest
from engine.query.conditions.below_newest_per import BelowNewestPer


@dataclass(frozen=True)
class PrunableFileEdits:
    """Matches the file edits that may go: those older than the table's newest kept rows, and those of an agent
    past its own newest kept_per_agent."""

    table: str
    kept_rows: int
    kept_per_agent: int

    def statement(self) -> Statement:
        return AnyOf([BelowNewest(self.table, self.kept_rows), BelowNewestPer(self.table, "session_agent_id", self.kept_per_agent)]).statement()
