from dataclasses import dataclass

from engine.database.statement import Statement
from engine.model.model import Model


@dataclass(frozen=True)
class AssignedTo:
    """Matches the rows of a model that are assigned to one of the actors."""

    model: type[Model]
    actor_ids: tuple[int, ...]

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in self.actor_ids)
        return Statement(f"id IN (SELECT subject_id FROM assignments WHERE subject_model = ? AND actor_id IN ({marks}))", [self.model.model_name, *self.actor_ids])
