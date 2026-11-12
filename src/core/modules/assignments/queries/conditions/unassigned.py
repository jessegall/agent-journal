from dataclasses import dataclass

from engine.database.statement import Statement
from engine.model.model import Model
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select


@dataclass(frozen=True)
class Unassigned:
    """Matches the rows of a model that are assigned to nobody."""

    model: type[Model]

    def statement(self) -> Statement:
        return SubqueryMatch("id", Select("assignments").matching(Equal("subject_model", self.model.model_name)).column("subject_id"), negated=True).statement()
