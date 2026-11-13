from dataclasses import dataclass

from engine.database.statement import Statement
from engine.model.model import Model
from engine.query.conditions.condition import Condition
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select


@dataclass(frozen=True)
class AssigneeMatch:
    """Matches the rows of a model that are assigned to an actor whose id the given query selects."""

    model: type[Model]
    actor_ids: Condition

    def statement(self) -> Statement:
        assigned = Select("assignments").matching(Equal("subject_model", self.model.model_name)).matching(SubqueryMatch("actor_id", self.actor_ids))
        return SubqueryMatch("id", assigned.column("subject_id")).statement()
