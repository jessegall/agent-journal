from dataclasses import dataclass


@dataclass(frozen=True)
class SharedRow:
    """The one row a share link shows: its model, its id and the environment it lives in."""

    model: str
    id: int
    environment_id: int
