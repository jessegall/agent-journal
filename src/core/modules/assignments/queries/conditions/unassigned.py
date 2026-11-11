from dataclasses import dataclass

from engine.database.statement import Statement
from engine.model.model import Model


@dataclass(frozen=True)
class Unassigned:
    """Matches the rows of a model that are assigned to nobody."""

    model: type[Model]

    def statement(self) -> Statement:
        return Statement("id NOT IN (SELECT subject_id FROM assignments WHERE subject_model = ?)", [self.model.model_name])
