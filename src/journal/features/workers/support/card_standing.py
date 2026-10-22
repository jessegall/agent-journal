from dataclasses import dataclass


@dataclass(frozen=True)
class CardStanding:
    """Where a worker's chat card says it stands: the words after its name, the tone they are shown in, and the line under them."""

    text: str
    tone: str = ""
    detail: str = ""
