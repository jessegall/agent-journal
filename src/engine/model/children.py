from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True)
class Children:
    """The rows an assignable model also assigns when one of its rows is assigned: the rows of `model` whose
    `column` holds the parent's id. With a link model, the parent's id is in `column` of the link rows, and
    their `link_column` holds the ids of the rows of `model`."""

    model: type[Model]
    column: str
    link_model: type[Model] | None = None
    link_column: str | None = None
