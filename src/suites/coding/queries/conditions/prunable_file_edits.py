from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.below_newest import BelowNewest


@dataclass(frozen=True)
class PrunableFileEdits:
    """Matches the file edits that may go: those older than the table's newest kept rows, and those of an agent
    past its own newest kept_per_agent."""

    table: str
    kept_rows: int
    kept_per_agent: int

    def statement(self) -> Statement:
        below_newest = BelowNewest(self.table, self.kept_rows).statement()
        return Statement(
            f"({below_newest.sql}) OR id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY session_agent_id ORDER BY id DESC) AS place"
            f' FROM "{self.table}") WHERE place > ?)',
            [*below_newest.parameters, self.kept_per_agent])
