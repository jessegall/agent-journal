from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True)
class Children:
    """The rows an assignable model also assigns when one of its rows is assigned: the rows of `model` whose
    `column` holds the parent's id, or, with `through`, the rows of `model` named by the column `to` in the rows
    of `through` whose `column` holds the parent's id."""

    model: type[Model]
    column: str
    through: type[Model] | None = None
    to: str | None = None
