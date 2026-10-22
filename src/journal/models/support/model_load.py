from dataclasses import dataclass


@dataclass(frozen=True)
class ModelLoad:
    """How many rows of one model a request turned into models."""

    model: str
    rows: int
