from dataclasses import dataclass

from engine.database.statement import Statement
from engine.model.model import Model
from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select


@dataclass(frozen=True)
class AssigneeAmong:
    """Matches the rows of a model that are assigned to one of the actors."""

    model: type[Model]
    actor_ids: tuple[int, ...]

    def statement(self) -> Statement:
        assigned = Select("assignments").matching(Equal("subject_model", self.model.model_name)).matching(Among("actor_id", self.actor_ids))
        return SubqueryMatch("id", assigned.column("subject_id")).statement()
