from dataclasses import dataclass


@dataclass(frozen=True)
class RowReference:
    """A row a stacked state or a constraint depends on, named by its model and its row id."""

    model: str
    row_id: int
