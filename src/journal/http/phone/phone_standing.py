from dataclasses import dataclass


@dataclass(frozen=True)
class PhoneStanding:
    """What the phone app is told of itself: its name and number, when its pairing ends, and the project it shows, with its colour."""

    phone: str
    id: int
    expires: str
    project: str
    color: str
