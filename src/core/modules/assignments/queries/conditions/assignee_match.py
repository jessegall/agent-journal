from dataclasses import dataclass

from engine.database.statement import Statement
from engine.model.model import Model
from engine.query.condition import Condition


@dataclass(frozen=True)
class AssigneeMatch:
    """Matches the rows of a model that are assigned to an actor whose id the given query selects."""

    model: type[Model]
    actor_ids: Condition

    def statement(self) -> Statement:
        inner = self.actor_ids.statement()
        return Statement(f"id IN (SELECT subject_id FROM assignments WHERE subject_model = ? AND actor_id IN ({inner.sql}))", [self.model.model_name, *inner.parameters])
