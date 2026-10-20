from dataclasses import dataclass


@dataclass(frozen=True)
class OpenTask:
    """An open task named by its number and title."""

    id: int
    title: str
