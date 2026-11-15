from dataclasses import dataclass


@dataclass(frozen=True)
class SubjectReference:
    """A row a frame or a constraint depends on, named by its model and its row id."""

    model: str
    row_id: int
