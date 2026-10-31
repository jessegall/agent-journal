from dataclasses import dataclass


@dataclass(frozen=True)
class FadedMemory:
    """An active memory faded to weight 0: kept, no longer given, back when its weight is raised."""

    id: int
    type: str
    text: str
