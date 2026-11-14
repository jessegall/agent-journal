from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.is_null import IsNull
from engine.query.select import Select
from engine.query.conditions.subquery_match import SubqueryMatch


@dataclass(frozen=True)
class ActiveAgentRows:
    """Matches rows whose column names an agent that has neither ended nor been retired."""

    column: str

    def statement(self) -> Statement:
        return SubqueryMatch(self.column, Select("agents").matching(IsNull("ended_at")).matching(IsNull("retired_at")).column("id")).statement()
