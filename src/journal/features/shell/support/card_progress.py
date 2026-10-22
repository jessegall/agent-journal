from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class CardProgress:
    """How far a watched run's card has come: its tone, the reader's figure and fraction for the bar, its count of a total and how it ended, the fields its card shows and a live card asks for every second."""

    tone: str
    figure: str
    fraction: float
    ending: str
    count: str

    def fields(self) -> dict:
        return asdict(self)
