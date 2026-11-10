from collections.abc import Sequence
from dataclasses import dataclass

from engine.change.changed import Changed, M
from engine.change.missing_row_error import MissingRowError
from engine.model.model import Model
from engine.model.move import Move


@dataclass(frozen=True)
class Updated(Changed[M]):
    """A row saved with new values and no move."""

    @property
    def previous(self) -> M:
        if self.old_row is None:
            raise MissingRowError("an update has the row as it stood before")
        return self.old_row

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return f"{model.model_name}.update"
