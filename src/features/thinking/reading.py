from dataclasses import dataclass

from resources.fields import Loaded

THINKING = "thinking"


@dataclass(frozen=True)
class Read(Loaded):
    path: str = ""
    offset: int = 0


def reading_place(row) -> str:
    """Where the feature's memory keeps how far this agent's transcript has been read."""
    return f"transcript|{row.title}"
